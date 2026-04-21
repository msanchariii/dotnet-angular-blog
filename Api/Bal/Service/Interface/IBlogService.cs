public interface IBlogService
{
    Task<ApiResponse<IEnumerable<FindBlogWithBookmark>>> GetAllBlogs(FindAllBlogsParameters @params);
    Task<ApiResponse<IEnumerable<FindBlogDto>>> GetBlogsByUser(Guid userId);
    Task<ApiResponse<FindBlogDto?>> GetBlogById(Guid blogId);
    Task<ApiResponse<FindBlogDto?>> CreateBlog(Guid userId, CreateBlogRequestDto request);
    Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid blogId, Guid userId, bool isAdmin, UpdateBlogRequestDto request);
    Task<ApiResponse<object?>> SoftDeleteBlog(Guid blogId, Guid userId, bool isAdmin);
    Task<ApiResponse<FindBlogDto?>> TogglePublish(Guid blogId, bool isPublished);
}
