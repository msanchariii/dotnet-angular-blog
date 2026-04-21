public class BlogService : IBlogService
{
    private readonly IBlogRepository _blogRepository;

    public BlogService(IBlogRepository blogRepository)
    {
        _blogRepository = blogRepository;
    }

    public async Task<ApiResponse<IEnumerable<FindBlogWithBookmark>>> GetAllBlogs(FindAllBlogsParameters @params)
    {
        try
        {
            var blogs = await _blogRepository.GetAllBlogs(@params);
            return new ApiResponse<IEnumerable<FindBlogWithBookmark>>
            {
                Success = true,
                Message = "Blogs fetched successfully",
                Data = blogs,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindBlogWithBookmark>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindBlogWithBookmark>(),
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

    public async Task<ApiResponse<FindBlogDto?>> CreateBlog(Guid userId, CreateBlogRequestDto request)
    {
        try
        {
            // Merge explicit request tags with hashtags detected in content.
            var contentTags = request.Content
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(word => word.StartsWith("#"))
                .Select(word => word.Trim().TrimStart('#'))
                .Where(tag => !string.IsNullOrWhiteSpace(tag));

            request.Tags = (request.Tags ?? Array.Empty<string>())
                .Concat(contentTags)
                .Select(tag => tag.Trim().ToLowerInvariant())
                .Where(tag => !string.IsNullOrWhiteSpace(tag))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            var blog = await _blogRepository.CreateBlog(userId, request);
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

    public async Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid blogId, Guid userId, bool isAdmin, UpdateBlogRequestDto request)
    {
        try
        {
            var blog = await _blogRepository.UpdateBlog(blogId, userId, isAdmin, request);
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

    public async Task<ApiResponse<object?>> SoftDeleteBlog(Guid blogId, Guid userId, bool isAdmin)
    {
        try
        {
            var deleted = await _blogRepository.SoftDeleteBlog(blogId, userId, isAdmin);
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

    public async Task<ApiResponse<FindBlogDto?>> TogglePublish(Guid blogId, bool isPublished)
    {
        try
        {
            var blog = await _blogRepository.TogglePublish(blogId, isPublished);
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
                Message = "Publish state updated successfully",
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
}
