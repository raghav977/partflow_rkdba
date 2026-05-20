using System;

namespace backend.Model.Entities;

public class Review
{
    public Guid Id { get; set; }

    // Relationships
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    // Details
    public int Rating { get; set; } // 1-5
    public string? Comment { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
