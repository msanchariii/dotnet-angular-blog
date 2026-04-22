using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


public class AuthService : IAuthService
{
    private readonly AuthRepository _authRepository;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(AuthRepository authRepository, IUserRepository userRepository, IConfiguration configuration)
    {
        _authRepository = authRepository;
        _userRepository = userRepository;
        _configuration = configuration;
    }
    // login service method
    public async Task<ApiResponse<AuthResponseDto?>> Login(LoginRequestDto request)
    {
        try
        {
            var user = await _authRepository.Login(request);
            if (user == null)
            {
                return new ApiResponse<AuthResponseDto?>
                {
                    Success = false,
                    Message = "Invalid email or password",
                    StatusCode = 400,
                };
            }

            var (token, expiresAt) = GenerateJwtToken(user);

            return new ApiResponse<AuthResponseDto?>
            {
                Success = true,
                Message = "Login successful",
                Data = new AuthResponseDto
                {
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = user
                },
                StatusCode = 200,
            };
        }
        catch (Exception)
        {
            // Don't expose internal error
            return new ApiResponse<AuthResponseDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }

    // register service method
    public async Task<ApiResponse<LoginResponseDto?>> Register(RegisterRequestDto request)
    {
        try
        {
            // check if user already exists

            var existingUser = await _userRepository.GetByEmail(request.Email);
            if (existingUser != null)
            {
                return new ApiResponse<LoginResponseDto?>
                {
                    Success = false,
                    Message = "Email already Exists",
                    StatusCode = 200,

                };
            }


            var user = await _authRepository.Register(request);
            if (user == null)
            {
                return new ApiResponse<LoginResponseDto?>
                {
                    Success = false,
                    Message = "Registration failed",
                    Data = null,
                    StatusCode = 400,
                };
            }

            return new ApiResponse<LoginResponseDto?>
            {
                Success = true,
                Message = "Registration successful",
                Data = user,
                StatusCode = 200,

            };
        }
        catch (Exception)
        {
            // Don't expose internal error
            return new ApiResponse<LoginResponseDto?>
            {
                Success = false,
                Message = "Something went wrong",
                StatusCode = 500
            };
        }
    }

    private (string Token, DateTime ExpiresAt) GenerateJwtToken(LoginResponseDto user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? string.Empty)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(
            Convert.ToDouble(jwtSettings["DurationInMinutes"])
        );

        var claims = new[]
        {
            new Claim("userId", user.UserId.ToString()),
            new Claim("name", user.FirstName + " " + user.LastName),
            new Claim("role", user.Role),
            new Claim("email", user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

}