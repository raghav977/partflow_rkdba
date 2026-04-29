using System;

namespace backend.Model.Entities;

public class User
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required UserRole Role { get; set; }

    public string ? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }

    
}


public enum UserRole
{
    Admin,
    Staff,
    Customer
}