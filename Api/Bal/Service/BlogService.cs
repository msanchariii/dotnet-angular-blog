public class BlogService : IBlogService
{
    private readonly IBlogRepository _blogRepository;

    public BlogService(IBlogRepository blogRepository)
    {
        _blogRepository = blogRepository;
    }

    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetAllBlogs(FindAllBlogsParameters @params)
    {
        try
        {
            var blogs = await _blogRepository.GetAllBlogs(@params);
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = true,
                Message = "Blogs fetched successfully",
                Data = blogs,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetBlogsByUser(Guid userId)
    {
        try
        {
            var blogs = await _blogRepository.GetBlogsByUser(userId);
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = true,
                Message = "User blogs fetched successfully",
                Data = blogs,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindBlogDto>(),
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<FindBlogDto?>> GetBlogById(Guid blogId)
    {
        try
        {
            var blog = await _blogRepository.GetBlogById(blogId);
            if (blog == null)
            {
                return new ApiResponse<FindBlogDto?>
                {
                    Success = false,
                    Message = "Blog not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            return new ApiResponse<FindBlogDto?>
            {
                Success = true,
                Message = "Blog fetched successfully",
                Data = blog,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<FindBlogDto?>> CreateBlog(CreateBlogRequestDto request)
    {
        try
        {
            var blog = await _blogRepository.CreateBlog(request);
            if (blog == null)
            {
                return new ApiResponse<FindBlogDto?>
                {
                    Success = false,
                    Message = "Blog creation failed",
                    Data = null,
                    StatusCode = 400
                };
            }

            return new ApiResponse<FindBlogDto?>
            {
                Success = true,
                Message = "Blog created successfully",
                Data = blog,
                StatusCode = 201
            };
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid blogId, UpdateBlogRequestDto request)
    {
        try
        {
            var blog = await _blogRepository.UpdateBlog(blogId, request);
            if (blog == null)
            {
                return new ApiResponse<FindBlogDto?>
                {
                    Success = false,
                    Message = "Blog not found or not owned by user",
                    Data = null,
                    StatusCode = 404
                };
            }

            return new ApiResponse<FindBlogDto?>
            {
                Success = true,
                Message = "Blog updated successfully",
                Data = blog,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<FindBlogDto?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<object?>> SoftDeleteBlog(Guid blogId, Guid userId)
    {
        try
        {
            var deleted = await _blogRepository.SoftDeleteBlog(blogId, userId);
            if (!deleted)
            {
                return new ApiResponse<object?>
                {
                    Success = false,
                    Message = "Blog not found or not owned by user",
                    Data = null,
                    StatusCode = 404
                };
            }

            return new ApiResponse<object?>
            {
                Success = true,
                Message = "Blog deleted successfully",
                Data = null,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<object?>
            {
                Success = false,
                Message = "Something went wrong",
                Data = null,
                StatusCode = 500
            };
        }
    }
}
