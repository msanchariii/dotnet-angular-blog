public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<ApiResponse<IEnumerable<FindUserDto>>> GetAllUsers()
    {
        try
        {
            var users = await _userRepository.GetAllUsers();

            return new ApiResponse<IEnumerable<FindUserDto>>
            {
                Success = true,
                Message = "Users fetched successfully",
                Data = users,
                StatusCode = 200
            };
        }
        catch (Exception)
        {
            return new ApiResponse<IEnumerable<FindUserDto>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindUserDto>(),
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<FindUserDto?>> GetUserById(Guid userId)
    {
        try
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                return new ApiResponse<FindUserDto?>
                {
                    Success = false,
                    Message = "User not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            return new ApiResponse<FindUserDto?>
            {
                Success = true,
                Message = "User fetched successfully",
                Data = user,
                StatusCode = 200
            };
        }
        catch (Exception)
        {
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }
}
