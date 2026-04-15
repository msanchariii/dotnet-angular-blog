public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<ApiResponse<IEnumerable<FindCategoryDto>>> GetAllCategories()
    {
        try
        {
            var categories = await _categoryRepository.GetAllCategories();
            return new ApiResponse<IEnumerable<FindCategoryDto>>
            {
                Success = true,
                Message = "Categories fetched successfully",
                Data = categories,
                StatusCode = 200
            };
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindCategoryDto>>
            {
                Success = false,
                Message = "Something went wrong",
                Data = Enumerable.Empty<FindCategoryDto>(),
                StatusCode = 500
            };
        }
    }
}
