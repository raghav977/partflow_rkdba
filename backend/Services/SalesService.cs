using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class SalesService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SalesService> _logger;
        private readonly IEmailService _emailService;
        private const decimal DISCOUNT_THRESHOLD = 5000;
        private const decimal DISCOUNT_PERCENTAGE = 0.10m; // 10% discount

        public SalesService(ApplicationDbContext context, ILogger<SalesService> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<SaleInvoiceResponseDto> CreateSaleInvoice(CreateSaleInvoiceDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate customer and vehicle exist
                var customer = await _context.Customers
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == dto.CustomerId);
                
                if (customer == null)
                    throw new InvalidOperationException("Customer not found");

                var vehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Id == dto.VehicleId && v.CustomerId == dto.CustomerId);
                
                if (vehicle == null)
                    throw new InvalidOperationException("Vehicle not found or does not belong to this customer");

                // Validate sale items
                if (dto.SaleItems == null || dto.SaleItems.Count == 0)
                    throw new InvalidOperationException("Sale items are required");

                // Create SaleInvoice
                var invoice = new SaleInvoice
                {
                    Id = Guid.NewGuid(),
                    CustomerId = dto.CustomerId,
                    VehicleId = dto.VehicleId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    SaleItems = new List<SaleItem>()
                };

                decimal totalAmount = 0;

                // Process each sale item
                foreach (var itemDto in dto.SaleItems)
                {
                    // Get part and validate
                    var part = await _context.Parts
                        .FirstOrDefaultAsync(p => p.Id == itemDto.PartId);
                    
                    if (part == null)
                        throw new InvalidOperationException($"Part {itemDto.PartId} not found");

                    // Validate stock quantity
                    if (part.StockQuantity < itemDto.Quantity)
                        throw new InvalidOperationException($"Insufficient stock for part {part.Name}. Available: {part.StockQuantity}, Required: {itemDto.Quantity}");

                    // Create sale item
                    var saleItem = new SaleItem
                    {
                        Id = Guid.NewGuid(),
                        SaleInvoiceId = invoice.Id,
                        PartId = itemDto.PartId,
                        Quantity = itemDto.Quantity,
                        Price = itemDto.Price,
                        Total = itemDto.Quantity * itemDto.Price,
                        CreatedAt = DateTime.UtcNow
                    };

                    totalAmount += saleItem.Total;
                    invoice.SaleItems.Add(saleItem);

                    // Reduce part stock
                    part.StockQuantity -= itemDto.Quantity;
                    _context.Parts.Update(part);
                }

                // Calculate discount
                decimal discount = 0;
                if (totalAmount > DISCOUNT_THRESHOLD)
                {
                    discount = totalAmount * DISCOUNT_PERCENTAGE;
                }

                invoice.TotalAmount = totalAmount;
                invoice.Discount = discount;
                invoice.FinalAmount = totalAmount - discount;

                // Save to database
                _context.SaleInvoices.Add(invoice);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation($"Sale invoice {invoice.Id} created successfully");

                // Send email if email provided
                if (!string.IsNullOrWhiteSpace(dto.Email))
                {
                    try
                    {
                        await _emailService.SendInvoiceEmailAsync(
                            dto.Email,
                            customer.User?.Name ?? "Customer",
                            invoice.Id.ToString(),
                            invoice.FinalAmount
                        );
                    }
                    catch (Exception emailEx)
                    {
                        // Log email error but don't fail the invoice creation
                        _logger.LogWarning($"Failed to send invoice email to {dto.Email}: {emailEx.Message}");
                    }
                }

                // Return response with included data
                return await GetSaleInvoiceById(invoice.Id);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Error creating sale invoice: {ex.Message}");
                throw;
            }
        }

        public async Task<SalesListResponseDto> GetSaleInvoices(int page = 1, int pageSize = 10, string? search = null)
        {
            try
            {
                var query = _context.SaleInvoices
                    .Include(s => s.Customer!)
                    .ThenInclude(c => c.User)
                    .Include(s => s.Vehicle)
                    .Include(s => s.SaleItems!)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(s =>
                        s.Customer!.User!.Name.Contains(search) ||
                        s.Vehicle!.VehicleNumber.Contains(search));
                }

                var totalSales = await query.CountAsync();

                var sales = await query
                    .OrderByDescending(s => s.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new SaleInvoiceResponseDto
                    {
                        Id = s.Id,
                        CustomerId = s.CustomerId,
                        CustomerName = s.Customer!.User!.Name,
                        VehicleId = s.VehicleId,
                        VehicleNumber = s.Vehicle!.VehicleNumber,
                        TotalAmount = s.TotalAmount,
                        Discount = s.Discount,
                        FinalAmount = s.FinalAmount,
                        CreatedAt = s.CreatedAt,
                        UpdatedAt = s.UpdatedAt,
                        SaleItems = s.SaleItems!.Select(si => new SaleItemResponseDto
                        {
                            Id = si.Id,
                            PartId = si.PartId,
                            PartName = si.Part!.Name,
                            Quantity = si.Quantity,
                            Price = si.Price,
                            Total = si.Total,
                            CreatedAt = si.CreatedAt
                        }).ToList()
                    })
                    .ToListAsync();

                return new SalesListResponseDto
                {
                    TotalSales = totalSales,
                    Page = page,
                    PageSize = pageSize,
                    Data = sales
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sales: {ex.Message}");
                throw;
            }
        }

        public async Task<SaleDetailResponseDto> GetSaleInvoiceDetail(Guid id)
        {
            try
            {
                var invoice = await _context.SaleInvoices
                    .Include(s => s.Customer!)
                    .ThenInclude(c => c.User)
                    .Include(s => s.Vehicle)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (invoice == null)
                    throw new InvalidOperationException("Sale invoice not found");

                // Get sale items separately
                var saleItems = await _context.SaleItems
                    .Where(si => si.SaleInvoiceId == id)
                    .Include(si => si.Part)
                    .ToListAsync();

                var discountPercentage = invoice.TotalAmount > 0 ? (invoice.Discount / invoice.TotalAmount) * 100 : 0;

                return new SaleDetailResponseDto
                {
                    Id = invoice.Id,
                    CustomerId = invoice.CustomerId,
                    CustomerName = invoice.Customer!.User!.Name,
                    CustomerPhone = invoice.Customer.User.PhoneNumber,
                    CustomerAddress = invoice.Customer.Address,
                    VehicleId = invoice.VehicleId,
                    VehicleNumber = invoice.Vehicle!.VehicleNumber,
                    VehicleBrand = invoice.Vehicle.Brand,
                    VehicleModel = invoice.Vehicle.Model,
                    TotalAmount = invoice.TotalAmount,
                    Discount = invoice.Discount,
                    DiscountPercentage = (decimal)Math.Round((double)discountPercentage, 2),
                    FinalAmount = invoice.FinalAmount,
                    CreatedAt = invoice.CreatedAt,
                    SaleItems = saleItems.Select(si => new SaleItemResponseDto
                    {
                        Id = si.Id,
                        PartId = si.PartId,
                        PartName = si.Part!.Name,
                        Quantity = si.Quantity,
                        Price = si.Price,
                        Total = si.Total,
                        CreatedAt = si.CreatedAt
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sale invoice detail: {ex.Message}");
                throw;
            }
        }
        private async Task<SaleInvoiceResponseDto> GetSaleInvoiceById(Guid id)
        {
            var invoice = await _context.SaleInvoices
                .Include(s => s.Customer!)
                .ThenInclude(c => c.User)
                .Include(s => s.Vehicle)
                .Include(s => s.SaleItems!)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (invoice == null)
                throw new InvalidOperationException("Sale invoice not found");

            return new SaleInvoiceResponseDto
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                CustomerName = invoice.Customer!.User!.Name,
                VehicleId = invoice.VehicleId,
                VehicleNumber = invoice.Vehicle!.VehicleNumber,
                TotalAmount = invoice.TotalAmount,
                Discount = invoice.Discount,
                FinalAmount = invoice.FinalAmount,
                CreatedAt = invoice.CreatedAt,
                UpdatedAt = invoice.UpdatedAt,
                SaleItems = invoice.SaleItems!.Select(si => new SaleItemResponseDto
                {
                    Id = si.Id,
                    PartId = si.PartId,
                    PartName = si.Part!.Name,
                    Quantity = si.Quantity,
                    Price = si.Price,
                    Total = si.Total,
                    CreatedAt = si.CreatedAt
                }).ToList()
            };
        }

        public async Task SendInvoiceEmail(Guid invoiceId, string email)
        {
            try
            {
                var invoice = await _context.SaleInvoices
                    .Include(si => si.Customer)
                    .ThenInclude(c => c!.User)
                    .FirstOrDefaultAsync(si => si.Id == invoiceId);

                if (invoice == null)
                    throw new InvalidOperationException("Invoice not found");

                // Send email
                await _emailService.SendInvoiceEmailAsync(
                    email,
                    invoice.Customer?.User?.Name ?? "Customer",
                    invoice.Id.ToString(),
                    invoice.FinalAmount
                );

                _logger.LogInformation($"Invoice {invoiceId} sent to {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending invoice email: {ex.Message}");
                throw;
            }
        }
    }
}
