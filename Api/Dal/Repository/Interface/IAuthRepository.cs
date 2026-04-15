using Api.Dal.Entities;

public interface IAuthRepository
{
     Task<FindUserDto?> Login(LoginRequestDto request);
     Task<LoginRequestDto?> Register(RegisterRequestDto request);
}