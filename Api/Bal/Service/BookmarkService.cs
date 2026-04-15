public class BookmarkService : IBookmarkService
{
    private readonly IBookmarkRepository _bookmarkRepository;

    public BookmarkService(IBookmarkRepository bookmarkRepository)
    {
        _bookmarkRepository = bookmarkRepository;
    }

    public async Task<ApiResponse<object?>> ToggleBookmark(ToggleBookmarkRequestDto request)
    {
        try
        {
            var isBookmarked = await _bookmarkRepository.ToggleBookmark(request.UserId, request.BlogId);

            return new ApiResponse<object?>
            {
                Success = true,
                Message = isBookmarked ? "Bookmark added" : "Bookmark removed",
                Data = new { isBookmarked },
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
