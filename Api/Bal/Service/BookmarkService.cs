public class BookmarkService : IBookmarkService
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly ILogger<BookmarkService> _logger;

    public BookmarkService(IBookmarkRepository bookmarkRepository, ILogger<BookmarkService> logger)
    {
        _bookmarkRepository = bookmarkRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<object?>> ToggleBookmark(Guid userId, Guid blogId)
    {
        try
        {
            var isBookmarked = await _bookmarkRepository.ToggleBookmark(userId, blogId);

            return new ApiResponse<object?>
            {
                Success = true,
                Message = isBookmarked ? "Bookmark added" : "Bookmark removed",
                Data = new { isBookmarked },
                StatusCode = 200
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in ToggleBookmark: {Message}", ex.Message);
            return new ApiResponse<object?>
            {
                Success = false,
                Message = $"Something went wrong: {ex.Message}",
                Data = null,
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponse<IEnumerable<FindBlogDto>>> GetUserBookmarks(Guid userId)
    {
        try
        {
            var blogs = await _bookmarkRepository.GetUserBookmarks(userId);

            return new ApiResponse<IEnumerable<FindBlogDto>>
            {
                Success = true,
                Message = "Bookmarks fetched successfully",
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
}
