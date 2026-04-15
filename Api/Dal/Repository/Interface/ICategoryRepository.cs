public interface ICategoryRepository
{
    Task<IEnumerable<FindCategoryDto>> GetAllCategories();
}
