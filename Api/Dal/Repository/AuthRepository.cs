using Dapper;

public class AuthRepository : IAuthRepository
{
    private readonly DapperContext _context;

    public AuthRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<FindUserDto?> Login(LoginRequestDto request)
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName
                      FROM users 
                      WHERE email = @Email AND password = @Password";

        var result = await connection.QueryFirstOrDefaultAsync<FindUserDto>(
            query,
            new { request.Email, request.Password }
        );
        return result;
    }

    public async Task<LoginRequestDto?> Register(RegisterRequestDto request)
    {
        using var connection = _context.CreateConnection();
        var query = @"INSERT INTO users (first_name, last_name, email, password) 
                      VALUES (@FirstName, @LastName, @Email, @Password) 
                      RETURNING id AS UserId, email AS Email";

        var result = await connection.QueryFirstAsync<LoginRequestDto>(
            query,
            new { request.FirstName, request.LastName, request.Email, request.Password }
        );
        return result;
    }

}