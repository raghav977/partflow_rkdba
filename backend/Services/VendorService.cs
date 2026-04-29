using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class VendorService
{
    private readonly ApplicationDbContext _dbContext;

    public VendorService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Create a new vendor
    /// </summary>
    public async Task CreateVendor(CreateVendorDto dto)
    {
        // Check if vendor with same email already exists
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            bool emailExists = await _dbContext.Vendors.AnyAsync(v => v.Email == dto.Email);
            if (emailExists)
                throw new InvalidOperationException("Vendor with this email already exists");
        }

        var vendor = new Vendor
        {
            Name = dto.Name,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Vendors.Add(vendor);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Get all vendors with pagination and search (searches Name or Phone)
    /// </summary>
    public async Task<VendorsListResponseDto> GetVendors(
        int page,
        int pageSize,
        string? search)
    {
        var query = _dbContext.Vendors.AsQueryable();
        query = query.Where(v => v.IsActive == true);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Name.Contains(search) ||
                (x.PhoneNumber != null && x.PhoneNumber.Contains(search)));
        }

        var totalVendors = await query.CountAsync();

        var vendors = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new VendorResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                Email = x.Email,
                Address = x.Address,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        return new VendorsListResponseDto
        {
            TotalVendors = totalVendors,
            Page = page,
            PageSize = pageSize,
            Data = vendors
        };
    }

    /// <summary>
    /// Get a vendor by ID
    /// </summary>
    public async Task<VendorResponseDto> GetVendorById(Guid id)
    {
        var vendor = await _dbContext.Vendors
            .Where(v => v.Id == id && v.IsActive == true)
            .Select(x => new VendorResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                Email = x.Email,
                Address = x.Address,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (vendor == null)
            throw new InvalidOperationException("Vendor not found");

        return vendor;
    }

    /// <summary>
    /// Update an existing vendor
    /// </summary>
    public async Task UpdateVendor(Guid id, UpdateVendorDto dto)
    {
        var vendor = await _dbContext.Vendors.FindAsync(id);
        if (vendor == null)
            throw new InvalidOperationException("Vendor not found");

        // Check email uniqueness if being updated
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != vendor.Email)
        {
            bool emailExists = await _dbContext.Vendors.AnyAsync(v => v.Email == dto.Email && v.Id != id);
            if (emailExists)
                throw new InvalidOperationException("Email already in use by another vendor");
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
            vendor.Name = dto.Name;
        if (dto.PhoneNumber != null)
            vendor.PhoneNumber = dto.PhoneNumber;
        if (dto.Email != null)
            vendor.Email = dto.Email;
        if (dto.Address != null)
            vendor.Address = dto.Address;

        vendor.UpdatedAt = DateTime.UtcNow;
        _dbContext.Vendors.Update(vendor);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Delete a vendor
    /// </summary>
    public async Task DeleteVendor(Guid id)
    {
        var vendor = await _dbContext.Vendors.FindAsync(id);
        System.Console.WriteLine($"DeleteVendor: Looking for vendor with ID {id}, found: {vendor != null}");
        if (vendor == null)
            throw new InvalidOperationException("Vendor not found");

        // _dbContext.Vendors.Remove(vendor);
        vendor.IsActive = false; // Soft delete by marking as inactive

        await _dbContext.SaveChangesAsync();
    }
}
