public class FindAllBlogsParameters
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? SortBy { get; set; }
    public string? Category { get; set; }
    public string[]? Tags { get; set; }
}