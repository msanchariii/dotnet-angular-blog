using Dapper;
using System.Text.RegularExpressions;

public class TagRepository : ITagRepository
{
    private readonly DapperContext _context;

    public TagRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FindTagDto>> GetAllTags()
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS TagId, tag_name AS TagName, slug AS Slug
                      FROM tag
                      ORDER BY tag_name";

        return await connection.QueryAsync<FindTagDto>(query);
    }

    public async Task<IEnumerable<FindTagDto>> FindOrCreateTags(IEnumerable<string> tagNames)
    {
        using var connection = _context.CreateConnection();

        var normalizedTags = tagNames
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        if (normalizedTags.Length == 0)
        {
            return Enumerable.Empty<FindTagDto>();
        }

        var tagPayload = normalizedTags
            .Select(tagName => new { TagName = tagName, Slug = Slugify(tagName) })
            .Where(tag => !string.IsNullOrWhiteSpace(tag.Slug))
            .ToArray();

        if (tagPayload.Length == 0)
        {
            return Enumerable.Empty<FindTagDto>();
        }

        var insertQuery = @"
            INSERT INTO tag (tag_name, slug)
            SELECT x.tag_name, x.slug
            FROM unnest(@TagNames::text[], @Slugs::text[]) AS x(tag_name, slug)
            ON CONFLICT (slug) DO UPDATE
            SET tag_name = EXCLUDED.tag_name;
        ";

        await connection.ExecuteAsync(insertQuery, new
        {
            TagNames = tagPayload.Select(tag => tag.TagName).ToArray(),
            Slugs = tagPayload.Select(tag => tag.Slug).ToArray()
        });

        var selectQuery = @"
            SELECT id AS TagId, tag_name AS TagName, slug AS Slug
            FROM tag
            WHERE slug = ANY(@Slugs)
            ORDER BY tag_name;
        ";

        return await connection.QueryAsync<FindTagDto>(selectQuery, new
        {
            Slugs = tagPayload.Select(tag => tag.Slug).ToArray()
        });
    }

    private static string Slugify(string value)
    {
        var slug = value.Trim().ToLowerInvariant();
        slug = Regex.Replace(slug, "[^a-z0-9]+", "-");
        return slug.Trim('-');
    }

}
