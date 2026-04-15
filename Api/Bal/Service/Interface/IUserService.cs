public interface IUserService
{
    Task<ApiResponse<IEnumerable<FindUserDto>>> GetAllUsers();
    Task<ApiResponse<FindUserDto?>> GetUserById(Guid userId);
}
