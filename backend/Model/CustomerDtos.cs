using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Model.DTOs;

// ============ APPOINTMENT DTOs ============

public class CreateAppointmentDto
{
    [Required(ErrorMessage = "Vehicle is required")]
    public Guid VehicleId { get; set; }

    [Required(ErrorMessage = "Appointment date is required")]
    public DateTime AppointmentDate { get; set; }

    [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
    public string? Notes { get; set; }
}

public class GetAppointmentDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid VehicleId { get; set; }
    public string VehicleNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AppointmentListResponseDto
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<GetAppointmentDto> Data { get; set; } = new();
}

// ============ STAFF APPOINTMENT DTOs ============

public class AdminGetAppointmentDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public Guid VehicleId { get; set; }
    public string VehicleNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdminAppointmentListResponseDto
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<AdminGetAppointmentDto> Data { get; set; } = new();
}

public class UpdateAppointmentStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    [Range(0, 3, ErrorMessage = "Status must be between 0 (Pending) and 3 (Cancelled)")]
    public int Status { get; set; }
}

// ============ PART REQUEST DTOs ============

public class CreatePartRequestDto
{
    [Required(ErrorMessage = "Part name is required")]
    [StringLength(100, ErrorMessage = "Part name cannot exceed 100 characters")]
    public string PartName { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }
}

public class GetPartRequestDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string PartName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class PartRequestListResponseDto
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<GetPartRequestDto> Data { get; set; } = new();
}

// ============ REVIEW DTOs ============

public class CreateReviewDto
{
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string? Comment { get; set; }
}

public class GetReviewDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ReviewListResponseDto
{
    public int Total { get; set; }
    public List<GetReviewDto> Data { get; set; } = new();
}
