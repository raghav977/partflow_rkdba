namespace backend.Model;

public class LoginResponseDto
{
    public required string Token { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
    public required string UserId { get; set; }
    public required string Name { get; set; }
}
