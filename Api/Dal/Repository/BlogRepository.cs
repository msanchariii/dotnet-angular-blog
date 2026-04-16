using System.Text.RegularExpressions;
using Dapper;
using System.Text;
using Npgsql;


public class BlogRepository : IBlogRepository
{
    private readonly DapperContext _context;

    public BlogRepository(DapperContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<FindBlogWithBookmark>> GetAllBlogs(FindAllBlogsParameters @params)
{
    using var connection = _context.CreateConnection();

    var sql = new StringBuilder();
    var parameters = new DynamicParameters();

    var pageNumber = Math.Max(1, @params.PageNumber);
    var pageSize = Math.Max(1, @params.PageSize);

    sql.Append(@"
        SELECT 
            b.id AS BlogId,

            -- AUTHOR
            b.author AS UserId,
            u.first_name || ' ' || u.last_name AS AuthorName,

            -- CATEGORY
            b.category_id AS CategoryId,
            c.category_name AS CategoryName,

            -- BLOG DATA
            b.blog_title AS Title,
            b.blog_content AS Content,

            COALESCE(
                array_agg(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL),
                ARRAY[]::text[]
            ) AS Tags,

            b.created_at AS CreatedAt,

            -- BOOKMARK
            CASE 
                WHEN bm.user_id IS NOT NULL THEN true
                ELSE false
            END AS IsBookmarked

        FROM blogs b
        LEFT JOIN users u 
            ON u.id = b.author AND u.is_deleted = false
        LEFT JOIN category c 
            ON c.id = b.category_id
        LEFT JOIN tag_blog tb 
            ON tb.blog_id = b.id
        LEFT JOIN tag t 
            ON t.id = tb.tag_id
        LEFT JOIN bookmark bm 
            ON bm.blog_id = b.id 
            AND bm.user_id = @UserId

        WHERE b.is_deleted = false AND b.is_published = true
    ");

    // ---------------- CATEGORY FILTER ----------------
    if (!string.IsNullOrWhiteSpace(@params.Category) &&
        Guid.TryParse(@params.Category, out var categoryId))
    {
        sql.Append(" AND b.category_id = @CategoryId ");
        parameters.Add("@CategoryId", categoryId);
    }

    // ---------------- TAG FILTER ----------------
    if (@params.Tags is { Length: > 0 })
    {
        sql.Append(@"
            AND b.id IN (
                SELECT tb2.blog_id
                FROM tag_blog tb2
                JOIN tag t2 ON t2.id = tb2.tag_id
                WHERE t2.tag_name = ANY(@Tags)
            )
        ");

        parameters.Add("@Tags", @params.Tags);
    }

    sql.Append(@"
        GROUP BY 
            b.id, b.author, u.first_name, u.last_name,
            b.category_id, c.category_name,
            b.blog_title, b.blog_content, b.created_at,
            bm.user_id
    ");

    // ---------------- SORTING ----------------
    var sort = @params.SortBy?.Trim().ToLowerInvariant();

    if (sort == "oldest")
    {
        sql.Append(" ORDER BY b.created_at ASC ");
    }
    else
    {
        sql.Append(" ORDER BY b.created_at DESC ");
    }

    // ---------------- PAGINATION ----------------
    sql.Append(" LIMIT @Limit OFFSET @Offset ");

    parameters.Add("@Limit", pageSize);
    parameters.Add("@Offset", (pageNumber - 1) * pageSize);

    // 🔥 IMPORTANT (userId can be Guid.Empty)
    parameters.Add("@UserId", @params.UserId ?? Guid.Empty);

    return await connection.QueryAsync<FindBlogWithBookmark>(sql.ToString(), parameters);
}
public async Task<IEnumerable<FindBlogDto>> GetBlogsByUser(Guid userId)
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT b.id AS BlogId,
                             b.author AS UserId,
                             b.blog_title AS Title,
                             b.is_published AS IsPublished,
                             b.blog_content AS Content,
                             b.category_id AS CategoryId,
                             COALESCE(array_agg(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL), ARRAY[]::text[]) AS Tags,
                             b.created_at AS CreatedAt
                      FROM blogs b
                      LEFT JOIN tag_blog tb ON tb.blog_id = b.id
                      LEFT JOIN tag t ON t.id = tb.tag_id
                      WHERE b.author = @UserId AND b.is_deleted = false
                      GROUP BY b.id, b.author, b.blog_title, b.blog_content, b.category_id, b.created_at
                      ORDER BY b.created_at DESC";

        return await connection.QueryAsync<FindBlogDto>(query, new { UserId = userId });
    }

    public async Task<FindBlogDto?> GetBlogById(Guid blogId)
    {
        using var connection = _context.CreateConnection();
        
        var query = @"SELECT b.id AS BlogId,
                             b.author AS UserId,
                             u.first_name || ' ' || u.last_name AS AuthorName,
                             b.blog_title AS Title,
                             b.is_published AS IsPublished,
                             b.blog_content AS Content,
                             b.category_id AS CategoryId,
                             c.category_name AS CategoryName,
                             COALESCE(array_agg(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL), ARRAY[]::text[]) AS Tags,
                             b.created_at AS CreatedAt
                      FROM blogs b
                      INNER JOIN users u ON u.id = b.author
                      INNER JOIN category c ON c.id = b.category_id
                      LEFT JOIN tag_blog tb ON tb.blog_id = b.id
                      LEFT JOIN tag t ON t.id = tb.tag_id
                      WHERE b.id = @BlogId AND b.is_deleted = false
                      GROUP BY b.id, b.author, u.first_name, u.last_name, b.blog_title, b.blog_content, b.category_id, c.category_name, b.created_at";

        return await connection.QueryFirstOrDefaultAsync<FindBlogDto>(query, new { BlogId = blogId });
    }

    public async Task<FindBlogDto?> CreateBlog(CreateBlogRequestDto request)
    {
        using var connection = _context.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            var query = @"INSERT INTO blogs (author, blog_title, blog_content, category_id, is_deleted)
                          VALUES (@UserId, @Title, @Content, @CategoryId, false)
                          RETURNING id";

            var blogId = await connection.ExecuteScalarAsync<Guid>(
                query,
                new { request.UserId, request.Title, request.Content, request.CategoryId },
                transaction
            );

            await UpsertAndAttachTags(connection, transaction, blogId, request.Tags);
            transaction.Commit();

            return await GetBlogById(blogId);
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<FindBlogDto?> UpdateBlog(Guid blogId, UpdateBlogRequestDto request)
    {
        using var connection = _context.CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        try
        {
            var query = @"UPDATE blogs
                          SET blog_title = @Title,
                              blog_content = @Content,
                              category_id = @CategoryId
                          WHERE id = @BlogId AND author = @UserId AND is_deleted = false";

            var updatedRows = await connection.ExecuteAsync(
                query,
                new { BlogId = blogId, request.UserId, request.Title, request.Content, request.CategoryId },
                transaction
            );

            if (updatedRows == 0)
            {
                transaction.Rollback();
                return null;
            }

            await connection.ExecuteAsync(
                "DELETE FROM tag_blog WHERE blog_id = @BlogId",
                new { BlogId = blogId },
                transaction
            );

            await UpsertAndAttachTags(connection, transaction, blogId, request.Tags);
            transaction.Commit();

            return await GetBlogById(blogId);
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> SoftDeleteBlog(Guid blogId, Guid userId)
    {
        using var connection = _context.CreateConnection();
        var query = @"UPDATE blogs
                      SET is_deleted = true
                      WHERE id = @BlogId AND author = @UserId AND is_deleted = false";

        var rows = await connection.ExecuteAsync(query, new { BlogId = blogId, UserId = userId });
        return rows > 0;
    }

    private static async Task UpsertAndAttachTags(
        System.Data.IDbConnection connection,
        System.Data.IDbTransaction transaction,
        Guid blogId,
        IEnumerable<string>? tags
    )
    {
        if (tags == null)
        {
            return;
        }

        var distinctTags = tags
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        foreach (var tagName in distinctTags)
        {
            var slug = Slugify(tagName);

            var tagId = await connection.ExecuteScalarAsync<Guid>(
                @"INSERT INTO tag (tag_name, slug)
                  VALUES (@TagName, @Slug)
                  ON CONFLICT (slug) DO UPDATE SET tag_name = EXCLUDED.tag_name
                  RETURNING id",
                new { TagName = tagName, Slug = slug },
                transaction
            );

            await connection.ExecuteAsync(
                @"INSERT INTO tag_blog (tag_id, blog_id)
                  VALUES (@TagId, @BlogId)
                  ON CONFLICT DO NOTHING",
                new { TagId = tagId, BlogId = blogId },
                transaction
            );
        }
    }

    private static string Slugify(string value)
    {
        var slug = value.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, "[^a-z0-9]+", "-");
        return slug.Trim('-');
    }
}
