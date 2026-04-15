public class CreateBlogRequestDto
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string[] Tags { get; set; } = [];
}
