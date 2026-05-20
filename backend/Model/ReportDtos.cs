using System;
using System.Collections.Generic;

namespace backend.Model;

// ============ DETAIL LINE ITEM DTOs ============

public class SaleLineItemDetailDto
{
    public string? PartName { get; set; }
    public string? SKU { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

public class PurchaseLineItemDetailDto
{
    public string? PartName { get; set; }
    public string? SKU { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

public class SalesTransactionDto
{
    public Guid InvoiceId { get; set; }
    public string? CustomerName { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Discount { get; set; }
    public decimal FinalAmount { get; set; }
    public List<SaleLineItemDetailDto>? Items { get; set; }
}

public class PurchaseTransactionDto
{
    public Guid InvoiceId { get; set; }
    public string? VendorName { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Discount { get; set; }
    public decimal FinalAmount { get; set; }
    public List<PurchaseLineItemDetailDto>? Items { get; set; }
}

// ============ FINANCIAL REPORT DTOs ============

public class DailyFinancialReportDto
{
    public DateTime Date { get; set; }
    public decimal TotalSales { get; set; }
    public decimal TotalPurchases { get; set; }
    public decimal TotalDiscount { get; set; }
    public int SalesCount { get; set; }
    public int PurchaseCount { get; set; }
    public decimal NetProfit { get; set; }
    public List<SalesTransactionDto>? SalesTransactions { get; set; }
    public List<PurchaseTransactionDto>? PurchaseTransactions { get; set; }
}

public class MonthlyFinancialReportDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal TotalSales { get; set; }
    public decimal TotalPurchases { get; set; }
    public decimal TotalDiscount { get; set; }
    public int SalesCount { get; set; }
    public int PurchaseCount { get; set; }
    public decimal NetProfit { get; set; }
    public List<SalesTransactionDto>? SalesTransactions { get; set; }
    public List<PurchaseTransactionDto>? PurchaseTransactions { get; set; }
}

public class YearlyFinancialReportDto
{
    public int Year { get; set; }
    public decimal TotalSales { get; set; }
    public decimal TotalPurchases { get; set; }
    public decimal TotalDiscount { get; set; }
    public int SalesCount { get; set; }
    public int PurchaseCount { get; set; }
    public decimal NetProfit { get; set; }
    public List<SalesTransactionDto>? SalesTransactions { get; set; }
    public List<PurchaseTransactionDto>? PurchaseTransactions { get; set; }
}

// ============ CUSTOMER REPORT DTOs ============

public class CustomerRegularDto
{
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? Email { get; set; }
    public int PurchaseCount { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime LastPurchaseDate { get; set; }
}

public class CustomerHighSpenderDto
{
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? Email { get; set; }
    public decimal TotalSpent { get; set; }
    public int PurchaseCount { get; set; }
    public decimal AveragePerPurchase { get; set; }
}

public class CustomerPendingCreditDto
{
    public Guid CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public decimal PendingAmount { get; set; }
    public int DaysOverdue { get; set; }
    public DateTime LastPurchaseDate { get; set; }
}

public class CustomerReportResponseDto
{
    public List<CustomerRegularDto>? RegularCustomers { get; set; }
    public List<CustomerHighSpenderDto>? HighSpenders { get; set; }
    public List<CustomerPendingCreditDto>? PendingCredits { get; set; }
}
