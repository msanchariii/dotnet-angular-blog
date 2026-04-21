public interface IBlogRepository
{
    Task<IEnumerable<FindBlogWithBookmark>> GetAllBlogs(FindAllBlogsParameters @params);
    Task<IEnumerable<FindBlogDto>> GetBlogsByUser(Guid userId);
    Task<FindBlogDto?> GetBlogById(Guid blogId);
    Task<FindBlogDto?> CreateBlog(Guid userId, CreateBlogRequestDto request);
    Task<FindBlogDto?> UpdateBlog(Guid blogId, Guid userId, bool isAdmin, UpdateBlogRequestDto request);
    Task<bool> SoftDeleteBlog(Guid blogId, Guid userId, bool isAdmin);
    Task<FindBlogDto?> TogglePublish(Guid blogId, bool isPublished);

    Task<BlogCount> GetBlogCount();
}
