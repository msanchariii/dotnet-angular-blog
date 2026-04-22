using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/blogs")]
public class BlogsController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogsController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    // [HttpGet("test-params")]
    // public async Task<ApiResponse<FindAllBlogsParameters>> TestParams([FromQuery] FindAllBlogsParameters @params)
    // {
    //     return new ApiResponse<FindAllBlogsParameters>
    //     {
    //         Success = true,
    //         Message = "Params received successfully",
    //         Data = @params,
    //         StatusCode = 200
    //     };
    // }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ApiResponse<IEnumerable<FindBlogWithBookmark>>> GetAllBlogs([FromQuery] FindAllBlogsParameters @params)
    {
        var currentUserId = GetCurrentUserId();
        @params.UserId = currentUserId == Guid.Empty ? null : currentUserId;

        try
        {
            return await _blogService.GetAllBlogs(@params);
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindBlogWithBookmark>>
            {
                Success = false,
                Message = "Internal server error",
                Data = Enumerable.Empty<FindBlogWithBookmark>(),
                StatusCode = 500
            };
        }
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("admin/all")]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetAllBlogsForAdmin([FromQuery] FindAllBlogsParameters @params)
    {
        try
        {
            return await _blogService.GetAllBlogsForAdmin(@params);
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

    [Authorize(Policy = "UserOrAdmin")]
    [HttpGet("get-blogs-by-user/{userId}")]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetBlogsByUser(Guid userId)
    {
        var currentUserId = GetCurrentUserId();
        var isAdmin = IsCurrentUserAdmin();

        if (currentUserId == Guid.Empty)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Unauthorized",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 401
            };
        }

        if (!isAdmin && currentUserId != userId)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Forbidden",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 403
            };
        }

        if (userId == Guid.Empty)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "User id is required",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.GetBlogsByUser(userId);
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

    [HttpGet("{id}")]
    public async Task<ApiResponse<FindBlogDto?>> GetBlogById(Guid id)
    {
        if (id == Guid.Empty)
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Blog id is required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.GetBlogById(id);
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }

    [Authorize(Policy = "UserOrAdmin")]
    [HttpGet("my")]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetMyBlogs()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == Guid.Empty)
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Unauthorized",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 401
            };
        }

        try
        {
            return await _blogService.GetBlogsByUser(currentUserId);
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

    [Authorize(Policy = "UserOrAdmin")]
    [HttpPost]
    public async Task<ApiResponse<FindBlogDto?>> CreateBlog([FromBody] CreateBlogRequestDto request)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == Guid.Empty || string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Content))
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Title and content are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.CreateBlog(currentUserId, request);
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }

    [Authorize(Policy = "UserOrAdmin")]
    [HttpPut("{id}")]
    public async Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid id, [FromBody] UpdateBlogRequestDto request)
    {
        var currentUserId = GetCurrentUserId();
        var isAdmin = IsCurrentUserAdmin();

        if (id == Guid.Empty || currentUserId == Guid.Empty || string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Content))
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "BlogId, title and content are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.UpdateBlog(id, currentUserId, isAdmin, request);
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }

    [Authorize(Policy = "UserOrAdmin")]
    [HttpDelete("{id}")]
    public async Task<ApiResponse<object?>> SoftDeleteBlog(Guid id)
    {
        var currentUserId = GetCurrentUserId();
        var isAdmin = IsCurrentUserAdmin();

        if (id == Guid.Empty || currentUserId == Guid.Empty)
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "BlogId is required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.SoftDeleteBlog(id, currentUserId, isAdmin);
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

    [Authorize(Policy = "AdminOnly")]
    [HttpPatch("{id}/publish")]
    public async Task<ApiResponse<FindBlogDto?>> TogglePublish(Guid id, [FromBody] TogglePublishRequestDto request)
    {
        if (id == Guid.Empty)
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "BlogId is required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.TogglePublish(id, request.IsPublished);
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Internal server error",
                Data = null,
                StatusCode = 500
            };
        }
    }

    private Guid GetCurrentUserId()
    {
        var rawUserId = User.FindFirst("userId")?.Value;

        return Guid.TryParse(rawUserId, out var userId) ? userId : Guid.Empty;
    }

    private bool IsCurrentUserAdmin()
    {
        var role = User.FindFirst("role")?.Value?.Trim();
        return string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
    }
}
