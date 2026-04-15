public interface IBookmarkService
{
    Task<ApiResponse<object?>> ToggleBookmark(ToggleBookmarkRequestDto request);
    Task<ApiResponse<IEnumerable<FindBlogDto>>> GetUserBookmarks(Guid userId);
}
