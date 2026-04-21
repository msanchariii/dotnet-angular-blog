using Api.Dal.Entities;

public interface IAuthRepository
{
     Task<LoginResponseDto?> Login(LoginRequestDto request);
     Task<LoginResponseDto?> Register(RegisterRequestDto request);
}