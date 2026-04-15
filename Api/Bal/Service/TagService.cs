public class TagService : ITagService
{
    private readonly ITagRepository _tagRepository;

    public TagService(ITagRepository tagRepository)
    {
        _tagRepository = tagRepository;
    }

    public async Task<ApiResponse<IEnumerable<FindTagDto>>> GetAllTags()
    {
        try
        {
            var tags = await _tagRepository.GetAllTags();
            return new ApiResponse<IEnumerable<FindTagDto>>
            {
                Success = true,
                Message = "Tags fetched successfully",
                Data = tags,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindTagDto>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindTagDto>(),
                StatusCode = 500
            };
        }
    }
}
