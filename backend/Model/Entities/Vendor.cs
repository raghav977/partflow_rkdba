namespace backend.Model.Entities;

public class Vendor
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<Part> Parts { get; set; } = new List<Part>();

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
