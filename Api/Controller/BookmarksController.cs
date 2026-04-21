using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/bookmarks")]
public class BookmarksController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarksController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [Authorize(Policy = "UserOrAdmin")]
    [HttpPost("toggle")]
    public async Task<ApiResponse<object?>> ToggleBookmark([FromBody] ToggleBookmarkRequestDto request)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == Guid.Empty || request.BlogId == Guid.Empty)
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "blogId is required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _bookmarkService.ToggleBookmark(currentUserId, request.BlogId);
        }
        catch
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }

    [Authorize(Policy = "UserOrAdmin")]
    [HttpGet("me")]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetMyBookmarks()
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == Guid.Empty)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Unauthorized",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 400
            };
        }

        try
        {
            return await _bookmarkService.GetUserBookmarks(currentUserId);
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Internal server error",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 500
            };
        }
    }

    private Guid GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(rawUserId, out var userId) ? userId : Guid.Empty;
    }
}
