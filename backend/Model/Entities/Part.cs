namespace backend.Model.Entities;

public class Part
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    // Foreign Key
    public Guid VendorId { get; set; }

    // Navigation
    public Vendor Vendor { get; set; } = null!;

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
