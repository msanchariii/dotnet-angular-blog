using Dapper;

public class UserRepository : IUserRepository
{
    private readonly DapperContext _context;

    public UserRepository(DapperContext context)
    {
        _context = context;
    }

    // Implement user-related data access methods here

    public async Task<FindUserDto?> GetByEmail(string email)
    {
        using var connection = _context.CreateConnection();
        var query = "SELECT id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName FROM users WHERE email = @Email";
        var result = await connection.QueryFirstOrDefaultAsync<FindUserDto>(query, new { Email = email });
        return result;
    }

    public async Task<IEnumerable<FindUserDto>> GetAllUsers()
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName
                      FROM users";

        return await connection.QueryAsync<FindUserDto>(query);
    }

    public async Task<FindUserDto?> GetUserById(Guid userId)
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName
                      FROM users
                      WHERE id = @UserId";

        return await connection.QueryFirstOrDefaultAsync<FindUserDto>(query, new { UserId = userId });
    }
}