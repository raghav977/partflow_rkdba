using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services;

/// <summary>
/// Service for managing purchase invoices and stock updates
/// </summary>
public class PurchaseService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PurchaseService> _logger;

    public PurchaseService(ApplicationDbContext context, ILogger<PurchaseService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Create a new purchase invoice and update stock quantities
    /// </summary>
    public async Task<PurchaseInvoiceResponseDto> CreatePurchaseInvoice(CreatePurchaseInvoiceDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Validate vendor exists
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Id == dto.VendorId);
            if (vendor == null)
                throw new InvalidOperationException("Vendor not found");

            // Validate purchase items
            if (dto.PurchaseItems == null || dto.PurchaseItems.Count == 0)
                throw new InvalidOperationException("Purchase items are required");

            // Create PurchaseInvoice
            var invoice = new PurchaseInvoice
            {
                Id = Guid.NewGuid(),
                VendorId = dto.VendorId,
                PurchaseDate = DateTime.UtcNow,
                Status = "Pending",
                Discount = dto.Discount,
                PurchaseItems = new List<PurchaseItem>()
            };

            decimal totalAmount = 0;

            // Process each purchase item
            foreach (var itemDto in dto.PurchaseItems)
            {
                // Get part and validate
                var part = await _context.Parts
                    .FirstOrDefaultAsync(p => p.Id == itemDto.PartId);

                if (part == null)
                    throw new InvalidOperationException($"Part {itemDto.PartId} not found");

                // Create purchase item
                var purchaseItem = new PurchaseItem
                {
                    Id = Guid.NewGuid(),
                    PurchaseInvoiceId = invoice.Id,
                    PartId = itemDto.PartId,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    Total = itemDto.Quantity * itemDto.Price,
                    CreatedAt = DateTime.UtcNow
                };

                totalAmount += purchaseItem.Total;
                invoice.PurchaseItems.Add(purchaseItem);

                // Update part stock
                part.StockQuantity += itemDto.Quantity;
                part.UpdatedAt = DateTime.UtcNow;
                _context.Parts.Update(part);
            }

            // Calculate final amount
            invoice.TotalAmount = totalAmount;
            invoice.FinalAmount = totalAmount - invoice.Discount;

            // Save to database
            _context.PurchaseInvoices.Add(invoice);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation($"Purchase invoice {invoice.Id} created successfully");

            // Return response
            return await GetPurchaseInvoiceById(invoice.Id);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError($"Error creating purchase invoice: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get all purchase invoices with pagination
    /// </summary>
    public async Task<PurchaseInvoiceListResponseDto> GetPurchaseInvoices(int page = 1, int pageSize = 10, string? search = null)
    {
        try
        {
            var query = _context.PurchaseInvoices
                .Include(pi => pi.Vendor)
                .Include(pi => pi.PurchaseItems)
                .ThenInclude(pit => pit.Part)
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(pi => pi.Vendor!.Name.ToLower().Contains(searchLower) ||
                                         pi.Status.ToLower().Contains(searchLower));
            }

            var totalCount = await query.CountAsync();
            var invoices = await query
                .OrderByDescending(pi => pi.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var data = invoices.Select(pi => new PurchaseInvoiceResponseDto
            {
                Id = pi.Id,
                VendorId = pi.VendorId,
                VendorName = pi.Vendor?.Name,
                TotalAmount = pi.TotalAmount,
                Discount = pi.Discount,
                FinalAmount = pi.FinalAmount,
                Status = pi.Status,
                PurchaseDate = pi.PurchaseDate,
                CreatedAt = pi.CreatedAt,
                PurchaseItems = pi.PurchaseItems?.Select(pit => new PurchaseItemResponseDto
                {
                    Id = pit.Id,
                    PartId = pit.PartId,
                    PartName = pit.Part?.Name,
                    Quantity = pit.Quantity,
                    Price = pit.Price,
                    Total = pit.Total,
                    CreatedAt = pit.CreatedAt
                }).ToList()
            }).ToList();

            return new PurchaseInvoiceListResponseDto
            {
                TotalPurchases = totalCount,
                Page = page,
                PageSize = pageSize,
                Data = data
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching purchase invoices: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Get purchase invoice details by ID
    /// </summary>
    public async Task<PurchaseInvoiceResponseDto> GetPurchaseInvoiceById(Guid id)
    {
        try
        {
            var invoice = await _context.PurchaseInvoices
                .Include(pi => pi.Vendor)
                .Include(pi => pi.PurchaseItems)
                .ThenInclude(pit => pit.Part)
                .FirstOrDefaultAsync(pi => pi.Id == id);

            if (invoice == null)
                throw new InvalidOperationException("Purchase invoice not found");

            return new PurchaseInvoiceResponseDto
            {
                Id = invoice.Id,
                VendorId = invoice.VendorId,
                VendorName = invoice.Vendor?.Name,
                TotalAmount = invoice.TotalAmount,
                Discount = invoice.Discount,
                FinalAmount = invoice.FinalAmount,
                Status = invoice.Status,
                PurchaseDate = invoice.PurchaseDate,
                CreatedAt = invoice.CreatedAt,
                PurchaseItems = invoice.PurchaseItems?.Select(pit => new PurchaseItemResponseDto
                {
                    Id = pit.Id,
                    PartId = pit.PartId,
                    PartName = pit.Part?.Name,
                    Quantity = pit.Quantity,
                    Price = pit.Price,
                    Total = pit.Total,
                    CreatedAt = pit.CreatedAt
                }).ToList()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching purchase invoice: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Update purchase invoice status
    /// </summary>
    public async Task<PurchaseInvoiceResponseDto> UpdatePurchaseInvoiceStatus(Guid id, string status)
    {
        try
        {
            var invoice = await _context.PurchaseInvoices.FirstOrDefaultAsync(pi => pi.Id == id);
            if (invoice == null)
                throw new InvalidOperationException("Purchase invoice not found");

            if (!new[] { "Pending", "Completed", "Cancelled" }.Contains(status))
                throw new InvalidOperationException("Invalid status");

            invoice.Status = status;
            invoice.UpdatedAt = DateTime.UtcNow;
            _context.PurchaseInvoices.Update(invoice);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Purchase invoice {id} status updated to {status}");

            return await GetPurchaseInvoiceById(id);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating purchase invoice: {ex.Message}");
            throw;
        }
    }
}
