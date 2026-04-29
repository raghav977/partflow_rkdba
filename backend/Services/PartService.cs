using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PartService
{
    private readonly ApplicationDbContext _dbContext;

    public PartService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Create a new part
    /// </summary>
    public async Task CreatePart(CreatePartDto dto)
    {
        // Check if vendor exists
        var vendorExists = await _dbContext.Vendors.AnyAsync(v => v.Id == dto.VendorId);
        if (!vendorExists)
            throw new InvalidOperationException("Vendor not found");

        var part = new Part
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            VendorId = dto.VendorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Parts.Add(part);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Get all parts with pagination and search (searches Name or Vendor.Name)
    /// </summary>
    public async Task<PartsListResponseDto> GetParts(
        int page,
        int pageSize,
        string? search)
    {
        var query = _dbContext.Parts.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Vendor.Name.Contains(search));
        }

        var totalParts = await query.CountAsync();

        var parts = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new PartResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                StockQuantity = x.StockQuantity,
                VendorId = x.VendorId,
                VendorName = x.Vendor.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        return new PartsListResponseDto
        {
            TotalParts = totalParts,
            Page = page,
            PageSize = pageSize,
            Data = parts
        };
    }

    /// <summary>
    /// Update an existing part
    /// </summary>
    public async Task UpdatePart(Guid id, UpdatePartDto dto)
    {
        var part = await _dbContext.Parts.FindAsync(id);
        if (part == null)
            throw new InvalidOperationException("Part not found");

        // Check if new vendor exists
        if (dto.VendorId.HasValue && dto.VendorId != part.VendorId)
        {
            var vendorExists = await _dbContext.Vendors.AnyAsync(v => v.Id == dto.VendorId);
            if (!vendorExists)
                throw new InvalidOperationException("Vendor not found");
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
            part.Name = dto.Name;
        if (dto.Description != null)
            part.Description = dto.Description;
        if (dto.Price.HasValue)
            part.Price = dto.Price.Value;
        if (dto.StockQuantity.HasValue)
            part.StockQuantity = dto.StockQuantity.Value;
        if (dto.VendorId.HasValue)
            part.VendorId = dto.VendorId.Value;

        part.UpdatedAt = DateTime.UtcNow;
        _dbContext.Parts.Update(part);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Get a part by ID
    /// </summary>
    public async Task<PartResponseDto> GetPartById(Guid id)
    {
        var part = await _dbContext.Parts
            .Where(x => x.Id == id)
            .Select(x => new PartResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                StockQuantity = x.StockQuantity,
                VendorId = x.VendorId,
                VendorName = x.Vendor.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (part == null)
            throw new InvalidOperationException("Part not found");

        return part;
    }

    /// <summary>
    /// Delete a part
    /// </summary>
    public async Task DeletePart(Guid id)
    {
        var part = await _dbContext.Parts.FindAsync(id);
        if (part == null)
            throw new InvalidOperationException("Part not found");

        _dbContext.Parts.Remove(part);
        await _dbContext.SaveChangesAsync();
    }
}
