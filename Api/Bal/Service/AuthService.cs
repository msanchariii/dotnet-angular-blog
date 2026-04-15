public class AuthService : IAuthService
{
    private readonly AuthRepository _authRepository;
    private readonly IUserRepository _userRepository;

    public AuthService(AuthRepository authRepository, IUserRepository userRepository)
    {
        _authRepository = authRepository;
        _userRepository = userRepository;
        
    }
    // login service method
    public async Task<ApiResponse<FindUserDto?>> Login(LoginRequestDto request)
    {
        try
        {
            var user = await _authRepository.Login(request);
            if (user == null)
            {
                return new ApiResponse<FindUserDto?>
                {
                    Success = false,
                    Message = "Invalid email or password",
                    StatusCode = 400,
                };
            }

            return new ApiResponse<FindUserDto?>
            {
                Success = true,
                Message = "Login successful",
                Data = user,
                StatusCode = 200,
            };
        }
        catch (Exception)
        {
            // Don't expose internal error
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }

    // register service method
    public async Task<ApiResponse<LoginRequestDto?>> Register(RegisterRequestDto request)
    {
        try
        {
            // check if user already exists

            var existingUser = await _userRepository.GetByEmail(request.Email);
            if (existingUser != null)
            {
                return new ApiResponse<LoginRequestDto?>
                {
                    Success = false,
                    Message = "Email already Exists",
                    StatusCode = 200,

                };
            }


            var user = await _authRepository.Register(request);
            if (user == null)
            {
                return new ApiResponse<LoginRequestDto?>
                {
                    Success = false,
                    Message = "Registration failed",
                    Data = null,
                    StatusCode = 400,
                };
            }

            return new ApiResponse<LoginRequestDto?>
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
            return new ApiResponse<LoginRequestDto?>
            {
                Success = false,
                Message = "Something went wrong",
                StatusCode = 500
            };
        }
    }
}