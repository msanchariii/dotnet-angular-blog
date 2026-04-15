public interface ICategoryService
{
    Task<ApiResponse<IEnumerable<FindCategoryDto>>> GetAllCategories();
}
