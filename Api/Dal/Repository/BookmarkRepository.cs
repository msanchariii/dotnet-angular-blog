using Dapper;

public class BookmarkRepository : IBookmarkRepository
{
    private readonly DapperContext _context;

    public BookmarkRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<bool> ToggleBookmark(Guid userId, Guid blogId)
    {
        using var connection = _context.CreateConnection();

            var existsQuery = @"SELECT 1
                                FROM bookmark
                                WHERE user_id = @UserId AND blog_id = @BlogId";

        var exists = await connection.QueryFirstOrDefaultAsync<int?>(
            existsQuery,
            new { UserId = userId, BlogId = blogId }
        );

        if (exists.HasValue)
        {
                var deleteQuery = @"DELETE FROM bookmark
                                    WHERE user_id = @UserId AND blog_id = @BlogId";

            await connection.ExecuteAsync(deleteQuery, new { UserId = userId, BlogId = blogId });
            return false;
        }

            var insertQuery = @"INSERT INTO bookmark (user_id, blog_id)
                                VALUES (@UserId, @BlogId)
                                ON CONFLICT DO NOTHING";

        await connection.ExecuteAsync(insertQuery, new { UserId = userId, BlogId = blogId });
        return true;
    }

    public async Task<IEnumerable<FindBlogDto>> GetUserBookmarks(Guid userId)
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT b.id AS BlogId,
                             b.author AS UserId,
                             u.first_name || ' ' || u.last_name AS AuthorName,
                             b.blog_title AS Title,
                             b.blog_content AS Content,
                             b.category_id AS CategoryId,
                             c.category_name AS CategoryName,
                             COALESCE(array_agg(DISTINCT t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL), ARRAY[]::text[]) AS Tags,
                             b.created_at AS CreatedAt
                    FROM bookmark bm
                      INNER JOIN blogs b ON b.id = bm.blog_id
                      LEFT JOIN tag_blog tb ON tb.blog_id = b.id
                      LEFT JOIN tag t ON t.id = tb.tag_id
                      LEFT JOIN users u ON u.id = b.author AND u.is_deleted = false
                      LEFT JOIN category c ON c.id = b.category_id
                      WHERE bm.user_id = @UserId AND b.is_deleted = false
                      GROUP BY b.id, b.author, b.blog_title, b.blog_content, b.category_id, b.created_at, u.first_name, u.last_name, c.category_name
                      ORDER BY b.created_at DESC";

        return await connection.QueryAsync<FindBlogDto>(query, new { UserId = userId });
    }
}
