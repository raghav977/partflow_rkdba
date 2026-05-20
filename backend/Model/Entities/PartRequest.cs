using System;

namespace backend.Model.Entities;

public class PartRequest
{
    public Guid Id { get; set; }

    // Relationships
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    // Details
    public string PartName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PartRequestStatus Status { get; set; } = PartRequestStatus.Pending;

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum PartRequestStatus
{
    Pending,
    Approved,
    Rejected
}
