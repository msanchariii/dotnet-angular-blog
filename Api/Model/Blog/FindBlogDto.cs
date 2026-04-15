public class FindBlogDto
{
    public Guid BlogId { get; set; }

    public Guid UserId { get; set; }
    public string AuthorName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    public Guid? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public string[] Tags { get; set; } = [];

    public DateTime? CreatedAt { get; set; }
    
}