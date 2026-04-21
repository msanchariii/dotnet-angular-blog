public class AuthResponseDto
{
    public required string Token { get; set; }
    public required DateTime ExpiresAt { get; set; }
    public required LoginResponseDto User { get; set; }
}