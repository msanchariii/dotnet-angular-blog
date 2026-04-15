using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/bookmarks")]
public class BookmarksController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarksController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpPost("toggle")]
    public async Task<ApiResponse<object?>> ToggleBookmark([FromBody] ToggleBookmarkRequestDto request)
    {
        if (request.UserId == Guid.Empty || request.BlogId == Guid.Empty)
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "userId and blogId are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _bookmarkService.ToggleBookmark(request);
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

    [HttpGet]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetUserBookmarks([FromQuery] Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "userId is required",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 400
            };
        }

        try
        {
            return await _bookmarkService.GetUserBookmarks(userId);
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
}
