using Dapper;

public class CategoryRepository : ICategoryRepository
{
    private readonly DapperContext _context;

    public CategoryRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FindCategoryDto>> GetAllCategories()
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS CategoryId, category_name AS CategoryName, slug AS Slug
                      FROM category
                      ORDER BY category_name";

        return await connection.QueryAsync<FindCategoryDto>(query);
    }
}
