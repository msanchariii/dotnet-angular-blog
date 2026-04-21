using Dapper;

public class AuthRepository : IAuthRepository
{
    private readonly DapperContext _context;

    public AuthRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<LoginResponseDto?> Login(LoginRequestDto request)
    {
        using var connection = _context.CreateConnection();
        var query = @"SELECT id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName, COALESCE(role, 'User') AS Role
                      FROM users 
                      WHERE email = @Email AND password = @Password";

        var result = await connection.QueryFirstOrDefaultAsync<LoginResponseDto>(
            query,
            new { request.Email, request.Password }
        );
        return result;
    }

    public async Task<LoginResponseDto?> Register(RegisterRequestDto request)
    {
        using var connection = _context.CreateConnection();
        var query = @"INSERT INTO users (first_name, last_name, email, password) 
                      VALUES (@FirstName, @LastName, @Email, @Password) 
                      RETURNING id AS UserId, email AS Email, first_name AS FirstName, last_name AS LastName, COALESCE(role, 'User') AS Role";

        var result = await connection.QueryFirstAsync<LoginResponseDto>(
            query,
            new { request.FirstName, request.LastName, request.Email, request.Password }
        );
        return result;
    }

}