using Dapper;

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
}
