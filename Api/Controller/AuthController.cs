using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ApiResponse<FindUserDto?>> Login([FromBody] LoginRequestDto request)
    {
        // validation: check if email and password are provided
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "Email and password are required",
                Data = null,
                StatusCode = 400

            };
        }
        try
       {
            return await _authService.Login(request);
        }
        catch (Exception)
        {
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "Internal server error",
                StatusCode = 500,

            };
        }
    }

    [HttpPost("register")]
    public async Task<ApiResponse<LoginRequestDto?>> Register([FromBody] RegisterRequestDto request)
    {
        // validation: check if all required fields are provided
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
        {
            return new ApiResponse<LoginRequestDto?>
            {
                Success = false,
                Message = "All fields are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _authService.Register(request);
        }
        catch (Exception)
        {
            return new ApiResponse<LoginRequestDto?>
            {
                Success = false,
                Message = "Internal server error",
                StatusCode = 500
            };
        }
    }
}