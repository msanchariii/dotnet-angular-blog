public interface IAuthService
{
    Task<ApiResponse<FindUserDto?>> Login(LoginRequestDto request);

    Task<ApiResponse<LoginRequestDto?>> Register(RegisterRequestDto request);
}