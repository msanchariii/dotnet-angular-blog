using Microsoft.AspNetCore.Mvc;

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

    [HttpGet]
    public async Task<ApiResponse<IEnumerable<FindBlogWithBookmark>>> GetAllBlogs([FromQuery] FindAllBlogsParameters @params)
    {
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

    [HttpGet("get-blogs-by-user/{userId}")]
    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetBlogsByUser(Guid userId)
    {
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

    [HttpPost]
    public async Task<ApiResponse<FindBlogDto?>> CreateBlog([FromBody] CreateBlogRequestDto request)
    {
        if (request.UserId == Guid.Empty || string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Content))
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "UserId, title and content are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.CreateBlog(request);
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

    [HttpPut("{id}")]
    public async Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid id, [FromBody] UpdateBlogRequestDto request)
    {
        if (id == Guid.Empty || request.UserId == Guid.Empty || string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Content))
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "BlogId, userId, title and content are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.UpdateBlog(id, request);
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

    [HttpDelete("{id}")]
    public async Task<ApiResponse<object?>> SoftDeleteBlog(Guid id, [FromQuery] Guid userId)
    {
        if (id == Guid.Empty || userId == Guid.Empty)
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "BlogId and userId are required",
                Data = null,
                StatusCode = 400
            };
        }

        try
        {
            return await _blogService.SoftDeleteBlog(id, userId);
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
}
