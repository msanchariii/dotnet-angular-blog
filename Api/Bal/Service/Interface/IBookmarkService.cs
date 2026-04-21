public interface IBookmarkService
{
    Task<ApiResponse<object?>> ToggleBookmark(Guid userId, Guid blogId);
    Task<ApiResponse<IEnumerable<FindBlogDto>>> GetUserBookmarks(Guid userId);
}
