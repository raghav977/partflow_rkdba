using System.ComponentModel.DataAnnotations;

namespace backend.Model;

public class LoginDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address format")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(1, ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}
