using System;
using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class VehicleService
{
    private readonly ApplicationDbContext _dbContext;

    public VehicleService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Get all vehicles with pagination and search (searches VehicleNumber, EngineNumber, ChassisNumber)
    /// </summary>
    public async Task<VehiclesListResponseDto> GetVehicles(
        int page,
        int pageSize,
        string? search)
    {
        var query = _dbContext.Vehicles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.VehicleNumber.Contains(search) ||
                x.EngineNumber.Contains(search) ||
                x.ChassisNumber.Contains(search));
        }

        var totalVehicles = await query.CountAsync();

        var vehicles = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new VehicleResponseDto
            {
                Id = x.Id,
                VehicleNumber = x.VehicleNumber,
                Brand = x.Brand,
                Model = x.Model,
                Status = x.Status,
                CustomerId = x.CustomerId,
                CustomerName = x.Customer.User.Name,
                CustomerPhone = x.Customer.User.PhoneNumber ?? string.Empty
            })
            .ToListAsync();

        return new VehiclesListResponseDto
        {
            TotalVehicles = totalVehicles,
            Page = page,
            PageSize = pageSize,
            Data = vehicles
        };
    }

    /// <summary>
    /// Get all vehicles for a specific customer
    /// </summary>
    
    public async Task<List<VehicleDetailResponseDto>> GetVehiclesByCustomer(Guid customerId)
    {
        Console.WriteLine($"Fetching vehicles for customerId: {customerId}");

        // The customerId passed here could be either:
        // 1. Direct Customer ID (from the database)
        // 2. User ID (from JWT token) - we need to find the corresponding Customer
        
        var actualCustomerId = customerId;
        
        // First, try to find if this is a User ID that maps to a Customer
        var customerByUserId = await _dbContext.Customers
            .Where(c => c.UserId == customerId)
            .Select(c => c.Id)
            .FirstOrDefaultAsync();
        
        if (customerByUserId != Guid.Empty)
        {
            actualCustomerId = customerByUserId;
        }

        var vehicles = await _dbContext.Vehicles
            .Where(x => x.CustomerId == actualCustomerId)
            .Include(x => x.Customer!)
            .ThenInclude(c => c.User)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new VehicleDetailResponseDto
            {
                Id = x.Id,
                VehicleNumber = x.VehicleNumber,
                ChassisNumber = x.ChassisNumber,
                EngineNumber = x.EngineNumber,
                Brand = x.Brand,
                Model = x.Model,
                Year = x.Year,
                FuelType = x.FuelType,
                Color = x.Color,
                MileageKm = x.MileageKm,
                Status = x.Status,
                CustomerId = x.CustomerId,
                CustomerName = x.Customer!.User.Name,
                CustomerEmail = x.Customer!.User.Email,
                CustomerPhone = x.Customer!.User.PhoneNumber,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        Console.WriteLine($"Fetched {vehicles.Count} vehicles");

        return vehicles;
    }
    public Task AddVehicleData(AddVehicleDto dto)
    {
        // checking the unique constraint for vehicle number
        // if exists, return error
        // else, add the vehicle to the database
        bool vehicleNumberExists = _dbContext.Vehicles.Any(v => v.VehicleNumber == dto.VehicleNumber);
        if (vehicleNumberExists)
        {
            throw new InvalidOperationException("Vehicle number already exists");
        }        

        var vehicle = new Vehicle
        {
            VehicleNumber = dto.VehicleNumber,
            Brand = dto.Brand,
            Model = dto.Model,
            Year = dto.Year,
            FuelType = dto.FuelType,
            Color = dto.Color,
            MileageKm = dto.MileageKm,
            CustomerId = dto.CustomerId,
            ChassisNumber = dto.ChassisNumber,
            EngineNumber = dto.EngineNumber,

        };

        _dbContext.Vehicles.Add(vehicle);
        return _dbContext.SaveChangesAsync();
    }

}
