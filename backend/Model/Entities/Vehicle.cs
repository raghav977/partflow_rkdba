using System;

namespace backend.Model.Entities;

public class Vehicle
{
    public Guid Id { get; set; }

    // Relationship
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    // Identity
    public string VehicleNumber { get; set; } = string.Empty;   // BA12PA1234
    public string ChassisNumber { get; set; } = string.Empty;
    public string EngineNumber { get; set; } = string.Empty;

    // Vehicle Details
    public string Brand { get; set; } = string.Empty;          // Toyota
    public string Model { get; set; } = string.Empty;          // Corolla
    public int? Year { get; set; }
    public required FuelType FuelType { get; set; }

    public VehicleColor Color { get; set; }

    // Usage
    public int? MileageKm { get; set; }

    // Status
    public VehicleStatus Status { get; set; } = VehicleStatus.Active;

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<SaleInvoice> SaleInvoices { get; set; } = new List<SaleInvoice>();
}



public enum FuelType
{
    Petrol,
    Diesel,
    Electric,
}

public enum VehicleStatus
{
    Active,
    Inactive,
    UnderMaintenance,
    Decommissioned
}

public enum VehicleColor
{
    Red,
    Blue,
    Green,
    Black,
    White,
    Silver,
    Gray,
}