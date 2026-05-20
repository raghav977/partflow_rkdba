using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Model;

public class AddStaffDTo
{
    [Required]
    public required string Name { get; set; }
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    public required string Email { get; set; }

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
    public required string Password { get; set; }

    [Required]
    public string ? PhoneNumber { get; set; }

    public string? Address { get; set; }
}
