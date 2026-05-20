using System.ComponentModel.DataAnnotations;
using backend.Model.Entities;

namespace backend.Model;

public class AddVehicleDto
{
    [Required]
    public Guid CustomerId { get; set; }

    [Required]
    [StringLength(30)]
    public string VehicleNumber { get; set; } = string.Empty;

    [StringLength(50)]
    public string ChassisNumber { get; set; } = string.Empty;

    [StringLength(50)]
    public string EngineNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Model { get; set; } = string.Empty;

    [Range(1950, 2100)]
    public int? Year { get; set; }

    [Required]
    public FuelType FuelType { get; set; }

    public VehicleColor Color { get; set; }

    [Range(0, 2000000)]
    public int? MileageKm { get; set; }
}