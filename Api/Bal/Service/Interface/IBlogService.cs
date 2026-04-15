public interface IBlogService
{
    Task<ApiResponse<IEnumerable<FindBlogDto>>> GetAllBlogs(FindAllBlogsParameters @params);
    Task<ApiResponse<IEnumerable<FindBlogDto>>> GetBlogsByUser(Guid userId);
    Task<ApiResponse<FindBlogDto?>> GetBlogById(Guid blogId);
    Task<ApiResponse<FindBlogDto?>> CreateBlog(CreateBlogRequestDto request);
    Task<ApiResponse<FindBlogDto?>> UpdateBlog(Guid blogId, UpdateBlogRequestDto request);
    Task<ApiResponse<object?>> SoftDeleteBlog(Guid blogId, Guid userId);
}
