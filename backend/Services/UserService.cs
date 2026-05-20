using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace backend.Services;

public class UserService
{
    private readonly ApplicationDbContext _db;

    public UserService(ApplicationDbContext dbContext)
    {
        _db = dbContext;
    }

    public async Task CreateStaff(AddStaffDTo dto)
    {
        bool emailExists =
            await _db.Users.AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
            throw new InvalidOperationException("Email already exists");

        string hashedPassword =
            BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var staff = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            PhoneNumber = dto.PhoneNumber,
            Role = UserRole.Staff,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(staff);
        await _db.SaveChangesAsync();
    }
    public async Task<UsersListResponseDto> GetUsers(
        int page,
        int pageSize,
        string? role,
        string? search)
    {
        var query = _db.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(x =>
                x.Role.ToString() == role);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Email.Contains(search));
        }

        var totalUsers = await query.CountAsync();

        var users = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new UserResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Role = x.Role.ToString()
            })
            .ToListAsync();

        return new UsersListResponseDto
        {
            TotalUsers = totalUsers,
            Page = page,
            PageSize = pageSize,
            Data = users
        };
    }
    public async Task<CustomersListResponseDto> GetCustomers(
        int page,
        int pageSize,
        string? search)
    {
        var query = _db.Customers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.User.Name.Contains(search) ||
                x.User.Email.Contains(search));
        }

        var totalCustomers = await query.CountAsync();

        var customers = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CustomerResponseDto
            {
                Id = x.Id,
                Name = x.User.Name,
                Email = x.User.Email,
                PhoneNumber = x.User.PhoneNumber ?? string.Empty
            })
            .ToListAsync();

        return new CustomersListResponseDto
        {
            TotalCustomers = totalCustomers,
            Page = page,
            PageSize = pageSize,
            Data = customers
        };
    }

    /// <summary>
    /// Get detailed customer information including vehicles and history
    /// </summary>
    public async Task<dynamic> GetCustomerDetails(Guid customerId)
    {
        var customer = await _db.Customers
            .Include(c => c.Vehicles)
            .FirstOrDefaultAsync(c => c.Id == customerId);

        if (customer == null)
            throw new InvalidOperationException("Customer not found");

        // Get all appointments for this customer
        var appointments = await _db.Appointments
            .Where(a => a.CustomerId == customerId)
            .Include(a => a.Vehicle)
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => new
            {
                Id = a.Id,
                VehicleId = a.VehicleId,
                VehicleNumber = a.Vehicle.VehicleNumber,
                AppointmentDate = a.AppointmentDate,
                Status = a.Status.ToString(),
                Notes = a.Notes,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        // Get all part requests for this customer
        var partRequests = await _db.PartRequests
            .Where(pr => pr.CustomerId == customerId)
            .OrderByDescending(pr => pr.CreatedAt)
            .Select(pr => new
            {
                Id = pr.Id,
                PartName = pr.PartName,
                Description = pr.Description,
                Status = pr.Status.ToString(),
                CreatedAt = pr.CreatedAt
            })
            .ToListAsync();

        return new
        {
            Id = customer.Id,
            Name = customer.User.Name,
            Email = customer.User.Email,
            PhoneNumber = customer.User.PhoneNumber ?? string.Empty,
            Address = customer.Address ?? string.Empty,
            CreatedAt = customer.CreatedAt,
            Vehicles = customer.Vehicles.Select(v => new
            {
                Id = v.Id,
                VehicleNumber = v.VehicleNumber,
                Brand = v.Brand,
                Model = v.Model,
                Year = v.Year,
                FuelType = v.FuelType,
                Color = v.Color,
                MileageKm = v.MileageKm,
                Status = v.Status,
                CreatedAt = v.CreatedAt
            }).ToList(),
            Appointments = appointments,
            PartRequests = partRequests
        };
    }

    public async Task CreateCustomer (AddStaffDTo dto, Guid?createdByUserId=null){
         bool emailExists =
            await _db.Users.AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
            throw new InvalidOperationException("Email already exists");

             await using var transaction =
        await _db.Database.BeginTransactionAsync();

        try{


        string hashedPassword =
            BCrypt.Net.BCrypt.HashPassword(dto.Password);

    
     var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            PhoneNumber = dto.PhoneNumber,
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        var customer = new Customer{
            UserId =user.Id,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();

        await transaction.CommitAsync();

        }
        catch{
            await transaction.RollbackAsync();
            throw;

        }
}
}