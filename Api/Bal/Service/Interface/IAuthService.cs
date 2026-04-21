public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto?>> Login(LoginRequestDto request);

    Task<ApiResponse<LoginResponseDto?>> Register(RegisterRequestDto request);
}