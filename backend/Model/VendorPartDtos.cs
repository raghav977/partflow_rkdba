using System.ComponentModel.DataAnnotations;

namespace backend.Model;

// =============== Vendor DTOs ===============

public class CreateVendorDto
{
    [Required]
    [StringLength(100)]
    public required string Name { get; set; }

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }
}

public class UpdateVendorDto
{
    [StringLength(100)]
    public string? Name { get; set; }

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }
}

public class VendorResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class VendorsListResponseDto
{
    public int TotalVendors { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public required List<VendorResponseDto> Data { get; set; }
}

// =============== Part DTOs ===============

public class CreatePartDto
{
    [Required]
    [StringLength(100)]
    public required string Name { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0.01, 1000000)]
    public decimal Price { get; set; }

    [Range(0, 1000000)]
    public int StockQuantity { get; set; }

    [Required]
    public Guid VendorId { get; set; }
}

public class UpdatePartDto
{
    [StringLength(100)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0.01, 1000000)]
    public decimal? Price { get; set; }

    [Range(0, 1000000)]
    public int? StockQuantity { get; set; }

    public Guid? VendorId { get; set; }
}

public class PartResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public Guid VendorId { get; set; }
    public required string VendorName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class PartsListResponseDto
{
    public int TotalParts { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public required List<PartResponseDto> Data { get; set; }
}
