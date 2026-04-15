public interface IBookmarkRepository
{
    Task<bool> ToggleBookmark(Guid userId, Guid blogId);
    Task<IEnumerable<FindBlogDto>> GetUserBookmarks(Guid userId);
}
