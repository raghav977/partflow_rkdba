using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Model
{
    // DTOs for SaleItem
    public class CreateSaleItemDto
    {
        [Required]
        public Guid PartId { get; set; }

        [Required]
        [Range(1, 1000)]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Price { get; set; }
    }

    public class SaleItemResponseDto
    {
        public Guid Id { get; set; }
        public Guid PartId { get; set; }
        public string? PartName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // DTOs for SaleInvoice
    public class CreateSaleInvoiceDto
    {
        [Required]
        public Guid CustomerId { get; set; }

        [Required]
        public Guid VehicleId { get; set; }

        [Required]
        public List<CreateSaleItemDto>? SaleItems { get; set; }

        public string? Email { get; set; } // Optional email for invoice
    }

    public class SaleInvoiceResponseDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public Guid VehicleId { get; set; }
        public string? VehicleNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<SaleItemResponseDto>? SaleItems { get; set; }
    }

    public class SalesListResponseDto
    {
        public int TotalSales { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<SaleInvoiceResponseDto>? Data { get; set; }
    }

    public class SaleDetailResponseDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public Guid VehicleId { get; set; }
        public string? VehicleNumber { get; set; }
        public string? VehicleBrand { get; set; }
        public string? VehicleModel { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal FinalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SaleItemResponseDto>? SaleItems { get; set; }
    }

    public class SendInvoiceEmailDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
