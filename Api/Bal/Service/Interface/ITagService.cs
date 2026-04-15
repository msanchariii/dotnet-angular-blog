public interface ITagService
{
    Task<ApiResponse<IEnumerable<FindTagDto>>> GetAllTags();
}
