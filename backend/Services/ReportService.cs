using backend.Data;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services;

/// <summary>
/// Service for generating financial and customer reports
/// </summary>
public class ReportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ReportService> _logger;

    public ReportService(ApplicationDbContext context, ILogger<ReportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    // ============ FINANCIAL REPORTS ============

    /// <summary>
    /// Get daily financial report for a specific date
    /// </summary>
    public async Task<DailyFinancialReportDto> GetDailyFinancialReport(DateTime date)
    {
        try
        {
            // Convert to UTC and get start of day
            var utcDate = date.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(date, DateTimeKind.Utc) 
                : date.ToUniversalTime();

            var startOfDay = new DateTime(utcDate.Year, utcDate.Month, utcDate.Day, 0, 0, 0, DateTimeKind.Utc);

            // Get sales data with items
            var salesData = await _context.SaleInvoices
                .Where(si => si.CreatedAt >= startOfDay && si.CreatedAt < startOfDay.AddDays(1))
                .Include(si => si.SaleItems)
                    .ThenInclude(sitem => sitem.Part)
                .Include(si => si.Customer)
                    .ThenInclude(c => c.User)
                .ToListAsync();

            var salesTransactions = new List<SalesTransactionDto>();
            foreach (var si in salesData)
            {
                var items = new List<SaleLineItemDetailDto>();
                if (si.SaleItems != null)
                {
                    items = si.SaleItems.Select(item => new SaleLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }
                
                salesTransactions.Add(new SalesTransactionDto
                {
                    InvoiceId = si.Id,
                    CustomerName = si.Customer?.User?.Name,
                    CreatedAt = si.CreatedAt,
                    TotalAmount = si.TotalAmount,
                    Discount = si.Discount,
                    FinalAmount = si.FinalAmount,
                    Items = items
                });
            }

            var totalSales = salesData.Sum(si => si.FinalAmount);
            var totalDiscount = salesData.Sum(si => si.Discount);

            // Get purchase data with items
            var purchaseData = await _context.PurchaseInvoices
                .Where(pi => pi.CreatedAt >= startOfDay && pi.CreatedAt < startOfDay.AddDays(1))
                .Include(pi => pi.PurchaseItems)
                    .ThenInclude(pitem => pitem.Part)
                .Include(pi => pi.Vendor)
                .ToListAsync();

            var purchaseTransactions = new List<PurchaseTransactionDto>();
            foreach (var pi in purchaseData)
            {
                var items = new List<PurchaseLineItemDetailDto>();
                if (pi.PurchaseItems != null)
                {
                    items = pi.PurchaseItems.Select(item => new PurchaseLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }

                purchaseTransactions.Add(new PurchaseTransactionDto
                {
                    InvoiceId = pi.Id,
                    VendorName = pi.Vendor?.Name,
                    CreatedAt = pi.CreatedAt,
                    TotalAmount = pi.TotalAmount,
                    Discount = pi.Discount,
                    FinalAmount = pi.FinalAmount,
                    Items = items
                });
            }

            var totalPurchases = purchaseData.Sum(pi => pi.FinalAmount);

            return new DailyFinancialReportDto
            {
                Date = utcDate,
                TotalSales = totalSales,
                TotalPurchases = totalPurchases,
                TotalDiscount = totalDiscount,
                SalesCount = salesData.Count,
                PurchaseCount = purchaseData.Count,
                NetProfit = totalSales - totalPurchases,
                SalesTransactions = salesTransactions,
                PurchaseTransactions = purchaseTransactions
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating daily report: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get monthly financial report
    /// </summary>
    public async Task<MonthlyFinancialReportDto> GetMonthlyFinancialReport(int year, int month)
    {
        try
        {
            var startOfMonth = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfMonth = startOfMonth.AddMonths(1);

            // Get sales data with items
            var salesData = await _context.SaleInvoices
                .Where(si => si.CreatedAt >= startOfMonth && si.CreatedAt < endOfMonth)
                .Include(si => si.SaleItems)
                    .ThenInclude(sitem => sitem.Part)
                .Include(si => si.Customer)
                    .ThenInclude(c => c.User)
                .ToListAsync();

            var salesTransactions = new List<SalesTransactionDto>();
            foreach (var si in salesData)
            {
                var items = new List<SaleLineItemDetailDto>();
                if (si.SaleItems != null)
                {
                    items = si.SaleItems.Select(item => new SaleLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }
                
                salesTransactions.Add(new SalesTransactionDto
                {
                    InvoiceId = si.Id,
                    CustomerName = si.Customer?.User?.Name,
                    CreatedAt = si.CreatedAt,
                    TotalAmount = si.TotalAmount,
                    Discount = si.Discount,
                    FinalAmount = si.FinalAmount,
                    Items = items
                });
            }

            var totalSales = salesData.Sum(si => si.FinalAmount);
            var totalDiscount = salesData.Sum(si => si.Discount);

            // Get purchase data with items
            var purchaseData = await _context.PurchaseInvoices
                .Where(pi => pi.CreatedAt >= startOfMonth && pi.CreatedAt < endOfMonth)
                .Include(pi => pi.PurchaseItems)
                    .ThenInclude(pitem => pitem.Part)
                .Include(pi => pi.Vendor)
                .ToListAsync();

            var purchaseTransactions = new List<PurchaseTransactionDto>();
            foreach (var pi in purchaseData)
            {
                var items = new List<PurchaseLineItemDetailDto>();
                if (pi.PurchaseItems != null)
                {
                    items = pi.PurchaseItems.Select(item => new PurchaseLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }

                purchaseTransactions.Add(new PurchaseTransactionDto
                {
                    InvoiceId = pi.Id,
                    VendorName = pi.Vendor?.Name,
                    CreatedAt = pi.CreatedAt,
                    TotalAmount = pi.TotalAmount,
                    Discount = pi.Discount,
                    FinalAmount = pi.FinalAmount,
                    Items = items
                });
            }

            var totalPurchases = purchaseData.Sum(pi => pi.FinalAmount);

            return new MonthlyFinancialReportDto
            {
                Year = year,
                Month = month,
                TotalSales = totalSales,
                TotalPurchases = totalPurchases,
                TotalDiscount = totalDiscount,
                SalesCount = salesData.Count,
                PurchaseCount = purchaseData.Count,
                NetProfit = totalSales - totalPurchases,
                SalesTransactions = salesTransactions,
                PurchaseTransactions = purchaseTransactions
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating monthly report: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get yearly financial report
    /// </summary>
    public async Task<YearlyFinancialReportDto> GetYearlyFinancialReport(int year)
    {
        try
        {
            var startOfYear = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var endOfYear = new DateTime(year + 1, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Get sales data with items
            var salesData = await _context.SaleInvoices
                .Where(si => si.CreatedAt >= startOfYear && si.CreatedAt < endOfYear)
                .Include(si => si.SaleItems)
                    .ThenInclude(sitem => sitem.Part)
                .Include(si => si.Customer)
                    .ThenInclude(c => c.User)
                .ToListAsync();

            var salesTransactions = new List<SalesTransactionDto>();
            foreach (var si in salesData)
            {
                var items = new List<SaleLineItemDetailDto>();
                if (si.SaleItems != null)
                {
                    items = si.SaleItems.Select(item => new SaleLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }
                
                salesTransactions.Add(new SalesTransactionDto
                {
                    InvoiceId = si.Id,
                    CustomerName = si.Customer?.User?.Name,
                    CreatedAt = si.CreatedAt,
                    TotalAmount = si.TotalAmount,
                    Discount = si.Discount,
                    FinalAmount = si.FinalAmount,
                    Items = items
                });
            }

            var totalSales = salesData.Sum(si => si.FinalAmount);
            var totalDiscount = salesData.Sum(si => si.Discount);

            // Get purchase data with items
            var purchaseData = await _context.PurchaseInvoices
                .Where(pi => pi.CreatedAt >= startOfYear && pi.CreatedAt < endOfYear)
                .Include(pi => pi.PurchaseItems)
                    .ThenInclude(pitem => pitem.Part)
                .Include(pi => pi.Vendor)
                .ToListAsync();

            var purchaseTransactions = new List<PurchaseTransactionDto>();
            foreach (var pi in purchaseData)
            {
                var items = new List<PurchaseLineItemDetailDto>();
                if (pi.PurchaseItems != null)
                {
                    items = pi.PurchaseItems.Select(item => new PurchaseLineItemDetailDto
                    {
                        PartName = item.Part?.Name,
                        SKU = item.Part?.Id.ToString().Substring(0, 8),
                        Quantity = item.Quantity,
                        UnitPrice = item.Price,
                        Total = item.Total
                    }).ToList();
                }

                purchaseTransactions.Add(new PurchaseTransactionDto
                {
                    InvoiceId = pi.Id,
                    VendorName = pi.Vendor?.Name,
                    CreatedAt = pi.CreatedAt,
                    TotalAmount = pi.TotalAmount,
                    Discount = pi.Discount,
                    FinalAmount = pi.FinalAmount,
                    Items = items
                });
            }

            var totalPurchases = purchaseData.Sum(pi => pi.FinalAmount);

            return new YearlyFinancialReportDto
            {
                Year = year,
                TotalSales = totalSales,
                TotalPurchases = totalPurchases,
                TotalDiscount = totalDiscount,
                SalesCount = salesData.Count,
                PurchaseCount = purchaseData.Count,
                NetProfit = totalSales - totalPurchases,
                SalesTransactions = salesTransactions,
                PurchaseTransactions = purchaseTransactions
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating yearly report: {ex.Message}");
            throw;
        }
    }

    // ============ CUSTOMER REPORTS ============

    /// <summary>
    /// Get regular customers (customers with more than 5 purchases)
    /// </summary>
    public async Task<List<CustomerRegularDto>> GetRegularCustomers(int minPurchases = 5)
    {
        try
        {
            var regularCustomers = await _context.SaleInvoices
                .Include(si => si.Customer)
                .ThenInclude(c => c.User)
                .GroupBy(si => si.CustomerId)
                .Where(g => g.Count() >= minPurchases)
                .Select(g => new CustomerRegularDto
                {
                    CustomerId = g.Key,
                    CustomerName = g.First().Customer!.User!.Name,
                    Email = g.First().Customer!.User!.Email,
                    PurchaseCount = g.Count(),
                    TotalSpent = g.Sum(si => si.FinalAmount),
                    LastPurchaseDate = g.Max(si => si.CreatedAt)
                })
                .OrderByDescending(c => c.PurchaseCount)
                .ToListAsync();

            return regularCustomers;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching regular customers: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get high spenders (customers who spent more than threshold)
    /// </summary>
    public async Task<List<CustomerHighSpenderDto>> GetHighSpenders(decimal minSpent = 50000)
    {
        try
        {
            var highSpenders = await _context.SaleInvoices
                .Include(si => si.Customer)
                .ThenInclude(c => c.User)
                .GroupBy(si => si.CustomerId)
                .Where(g => g.Sum(si => si.FinalAmount) >= minSpent)
                .Select(g => new CustomerHighSpenderDto
                {
                    CustomerId = g.Key,
                    CustomerName = g.First().Customer!.User!.Name,
                    Email = g.First().Customer!.User!.Email,
                    TotalSpent = g.Sum(si => si.FinalAmount),
                    PurchaseCount = g.Count(),
                    AveragePerPurchase = g.Average(si => si.FinalAmount)
                })
                .OrderByDescending(c => c.TotalSpent)
                .ToListAsync();

            return highSpenders;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching high spenders: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get customers with pending credits for more than 30 days
    /// </summary>
    public async Task<List<CustomerPendingCreditDto>> GetPendingCredits(int daysOverdue = 30)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-daysOverdue);

            var pendingCredits = await _context.SaleInvoices
                .Include(si => si.Customer)
                .ThenInclude(c => c.User)
                .Where(si => si.CreatedAt <= cutoffDate) // Older than threshold
                .GroupBy(si => si.CustomerId)
                .Select(g => new CustomerPendingCreditDto
                {
                    CustomerId = g.Key,
                    CustomerName = g.First().Customer!.User!.Name,
                    Email = g.First().Customer!.User!.Email,
                    PhoneNumber = g.First().Customer!.User!.PhoneNumber,
                    PendingAmount = g.Sum(si => si.FinalAmount),
                    DaysOverdue = (int)(DateTime.UtcNow - g.Min(si => si.CreatedAt)).TotalDays,
                    LastPurchaseDate = g.Max(si => si.CreatedAt)
                })
                .OrderByDescending(c => c.DaysOverdue)
                .ToListAsync();

            return pendingCredits;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching pending credits: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get comprehensive customer report
    /// </summary>
    public async Task<CustomerReportResponseDto> GetCustomerReport()
    {
        try
        {
            var regular = await GetRegularCustomers();
            var highSpenders = await GetHighSpenders();
            var pendingCredits = await GetPendingCredits();

            return new CustomerReportResponseDto
            {
                RegularCustomers = regular,
                HighSpenders = highSpenders,
                PendingCredits = pendingCredits
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating customer report: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get low stock parts (stock < 10)
    /// </summary>
    public async Task<List<dynamic>> GetLowStockParts(int threshold = 10)
    {
        try
        {
            var lowStockParts = await _context.Parts
                .Include(p => p.Vendor)
                .Where(p => p.StockQuantity < threshold)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.StockQuantity,
                    p.Price,
                    VendorName = p.Vendor.Name,
                    p.VendorId
                })
                .OrderBy(p => p.StockQuantity)
                .ToListAsync<dynamic>();

            return lowStockParts;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching low stock parts: {ex.Message}");
            throw;
        }
    }
}
