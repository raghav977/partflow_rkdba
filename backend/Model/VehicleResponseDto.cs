using backend.Model.Entities;

namespace backend.Model;

public class VehicleResponseDto
{
    public Guid Id { get; set; }
    public required string VehicleNumber { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public VehicleStatus Status { get; set; }
    public Guid CustomerId { get; set; }
    public required string CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
}

public class VehiclesListResponseDto
{
    public int TotalVehicles { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public required List<VehicleResponseDto> Data { get; set; }
}

public class VehicleDetailResponseDto
{
    public Guid Id { get; set; }
    public required string VehicleNumber { get; set; }
    public string? ChassisNumber { get; set; }
    public string? EngineNumber { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public FuelType? FuelType { get; set; }
    public VehicleColor? Color { get; set; }
    public int? MileageKm { get; set; }
    public VehicleStatus Status { get; set; }
    public Guid CustomerId { get; set; }
    public required string CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
