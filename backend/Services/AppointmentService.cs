using backend.Data;
using backend.Model.DTOs;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AppointmentService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AppointmentService> _logger;

    public AppointmentService(ApplicationDbContext context, ILogger<AppointmentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<GetAppointmentDto> CreateAppointmentAsync(Guid userId, CreateAppointmentDto dto)
{
    // 🔥 STEP 1: Map User → Customer
    var customerId = await _context.Customers
        .Where(c => c.UserId == userId)
        .Select(c => c.Id)
        .FirstOrDefaultAsync();

    if (customerId == Guid.Empty)
        throw new InvalidOperationException("Customer not found");

    // 🔥 STEP 2: Validate vehicle ownership
    var vehicle = await _context.Vehicles
        .FirstOrDefaultAsync(v => v.Id == dto.VehicleId && v.CustomerId == customerId);

    if (vehicle == null)
        throw new InvalidOperationException("Vehicle not found or does not belong to this customer");

    // 🔥 STEP 3: Create appointment
    var appointment = new Appointment
    {
        Id = Guid.NewGuid(),
        CustomerId = customerId,
        VehicleId = dto.VehicleId,
        AppointmentDate = dto.AppointmentDate.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(dto.AppointmentDate, DateTimeKind.Utc)
            : dto.AppointmentDate,
        Notes = dto.Notes,
        Status = AppointmentStatus.Pending,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    _context.Appointments.Add(appointment);
    await _context.SaveChangesAsync();

    return MapToGetDto(appointment,vehicle);
}

    public async Task<AppointmentListResponseDto> GetAppointmentsByCustomerAsync(
        Guid customerId, int page = 1, int pageSize = 10)
    {
        try
        {
            var cId = await _context.Customers
                .Where(c => c.UserId == customerId)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            if (cId == Guid.Empty)
                throw new InvalidOperationException("Customer not found");

            Console.WriteLine($"Fetching appointments for Customer ID: {cId} (User ID: {customerId})");
            var query = _context.Appointments
                .Where(a => a.CustomerId == cId)
                .Include(a => a.Vehicle)
                .OrderByDescending(a => a.CreatedAt);


            var total = await query.CountAsync();
            var appointments = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var data = appointments.Select(a => MapToGetDto(a, a.Vehicle)).ToList();

            return new AppointmentListResponseDto
            {
                Total = total,
                Page = page,
                PageSize = pageSize,
                Data = data
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching appointments: {ex.Message}");
            throw;
        }
    }

    // ============ STAFF/ADMIN METHODS ============

    public async Task<AdminAppointmentListResponseDto> GetAllAppointmentsAsync(int page = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.Appointments
                .Include(a => a.Vehicle)
                .Include(a => a.Customer)
                    .ThenInclude(c => c.User)
                .OrderByDescending(a => a.CreatedAt);

            var total = await query.CountAsync();
            var appointments = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var data = appointments.Select(a => MapToAdminDto(a)).ToList();

            return new AdminAppointmentListResponseDto
            {
                Total = total,
                Page = page,
                PageSize = pageSize,
                Data = data
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching all appointments: {ex.Message}");
            throw;
        }
    }

    public async Task<AdminGetAppointmentDto> UpdateAppointmentStatusAsync(Guid id, int status)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Vehicle)
            .Include(a => a.Customer)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            throw new InvalidOperationException("Appointment not found");

        var newStatus = (AppointmentStatus)status;

        // Validate status transitions
        var currentStatus = appointment.Status;
        var validTransitions = new Dictionary<AppointmentStatus, List<AppointmentStatus>>
        {
            { AppointmentStatus.Pending, new List<AppointmentStatus> { AppointmentStatus.Confirmed, AppointmentStatus.Cancelled } },
            { AppointmentStatus.Confirmed, new List<AppointmentStatus> { AppointmentStatus.Completed, AppointmentStatus.Cancelled } },
            { AppointmentStatus.Completed, new List<AppointmentStatus>() },
            { AppointmentStatus.Cancelled, new List<AppointmentStatus>() }
        };

        if (!validTransitions[currentStatus].Contains(newStatus))
        {
            throw new InvalidOperationException(
                $"Cannot transition from {currentStatus} to {newStatus}");
        }

        appointment.Status = newStatus;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToAdminDto(appointment);
    }

    // ============ MAPPING HELPERS ============

    private AdminGetAppointmentDto MapToAdminDto(Appointment appointment)
    {
        return new AdminGetAppointmentDto
        {
            Id = appointment.Id,
            CustomerId = appointment.CustomerId,
            CustomerName = appointment.Customer?.User?.Name ?? "Unknown",
            VehicleId = appointment.VehicleId,
            VehicleNumber = appointment.Vehicle?.VehicleNumber ?? "",
            Brand = appointment.Vehicle?.Brand ?? "",
            Model = appointment.Vehicle?.Model ?? "",
            AppointmentDate = appointment.AppointmentDate,
            Status = appointment.Status.ToString(),
            Notes = appointment.Notes,
            CreatedAt = appointment.CreatedAt
        };
    }

    private GetAppointmentDto MapToGetDto(Appointment appointment, Vehicle vehicle)
    {
        return new GetAppointmentDto
        {
            Id = appointment.Id,
            CustomerId = appointment.CustomerId,
            VehicleId = appointment.VehicleId,
            VehicleNumber = vehicle.VehicleNumber,
            Brand = vehicle.Brand,
            Model = vehicle.Model,
            AppointmentDate = appointment.AppointmentDate,
            Status = appointment.Status.ToString(),
            Notes = appointment.Notes,
            CreatedAt = appointment.CreatedAt
        };
    }
}
