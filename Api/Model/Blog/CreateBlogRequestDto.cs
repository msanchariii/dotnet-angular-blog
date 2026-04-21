public class CreateBlogRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string[] Tags { get; set; } = [];
}
