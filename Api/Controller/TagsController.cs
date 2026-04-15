using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tags")]
public class TagsController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public async Task<ApiResponse<IEnumerable<FindTagDto>>> GetAllTags()
    {
        try
        {
            return await _tagService.GetAllTags();
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindTagDto>>
            {
                Success = false,
                Message = "Internal server error",
                Data = Enumerable.Empty<FindTagDto>(),
                StatusCode = 500
            };
        }
    }
}
