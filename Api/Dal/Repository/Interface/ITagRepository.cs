public interface ITagRepository
{
    Task<IEnumerable<FindTagDto>> GetAllTags();

    Task<IEnumerable<FindTagDto>> FindOrCreateTags(IEnumerable<string> tagNames);
}
