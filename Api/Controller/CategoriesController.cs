using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ApiResponse<IEnumerable<FindCategoryDto>>> GetAllCategories()
    {
        try
        {
            return await _categoryService.GetAllCategories();
        }
        catch
        {
            return new ApiResponse<IEnumerable<FindCategoryDto>>
            {
                Success = false,
                Message = "Internal server error",
                Data = Enumerable.Empty<FindCategoryDto>(),
                StatusCode = 500
            };
        }
    }
}
