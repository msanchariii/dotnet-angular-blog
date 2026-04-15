using Api.Dal.Entities;

public interface IUserRepository
{
    Task<FindUserDto?> GetByEmail(string email);
    Task<IEnumerable<FindUserDto>> GetAllUsers();
    Task<FindUserDto?> GetUserById(Guid userId);
}