using System;

namespace backend.Model.Entities;

public class Customer
{
    public Guid Id { get; set; }

    // FK to Users table
    public Guid UserId { get; set; }

    public User User { get; set; }

    // Who created this customer (staff/admin)
    public Guid? CreatedByUserId { get; set; }

    public User? CreatedByUser { get; set; }

    public string? Address { get; set; }

    public decimal DueBalance { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    public ICollection<SaleInvoice> SaleInvoices { get; set; } = new List<SaleInvoice>();

}