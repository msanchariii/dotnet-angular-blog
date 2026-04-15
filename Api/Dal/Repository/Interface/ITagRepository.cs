public interface ITagRepository
{
    Task<IEnumerable<FindTagDto>> GetAllTags();
}
