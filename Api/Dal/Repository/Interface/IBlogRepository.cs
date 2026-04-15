public interface IBlogRepository
{
    Task<IEnumerable<FindBlogDto>> GetAllBlogs(FindAllBlogsParameters @params);
    Task<IEnumerable<FindBlogDto>> GetBlogsByUser(Guid userId);
    Task<FindBlogDto?> GetBlogById(Guid blogId);
    Task<FindBlogDto?> CreateBlog(CreateBlogRequestDto request);
    Task<FindBlogDto?> UpdateBlog(Guid blogId, UpdateBlogRequestDto request);
    Task<bool> SoftDeleteBlog(Guid blogId, Guid userId);
}
