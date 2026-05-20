namespace backend.Model;

public class UserResponseDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
}

public class UsersListResponseDto
{
    public required int TotalUsers { get; set; }
    public required int Page { get; set; }
    public required int PageSize { get; set; }
    public required List<UserResponseDto> Data { get; set; }
}
