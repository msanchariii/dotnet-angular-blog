using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("get-all-users")]
    public async Task<ApiResponse<IEnumerable<FindUserDto>>> GetAllUsers()
    {
        try
        {
            return await _userService.GetAllUsers();
        }
        catch (Exception)
        {
            return new ApiResponse<IEnumerable<FindUserDto>>
            {
                Success = false,
                Message = "Internal server error",
                Data = Enumerable.Empty<FindUserDto>(),
                StatusCode = 500
            };
        }
    }

    [HttpGet("get-user-by-id/{userId}")]
    public async Task<ApiResponse<FindUserDto?>> GetUserById(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "User id is required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _userService.GetUserById(userId);
        }
        catch (Exception)
        {
            return new ApiResponse<FindUserDto?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }
}
