using backend.Model.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentService _appointmentService;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(AppointmentService appointmentService, ILogger<AppointmentsController> logger)
    {
        _appointmentService = appointmentService;
        _logger = logger;
    }

    // ============ CUSTOMER ENDPOINTS ============

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get customer ID from JWT token
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerId) || !Guid.TryParse(customerId, out var customerGuid))
            {
                return Unauthorized("Unable to identify customer");
            }

            var result = await _appointmentService.CreateAppointmentAsync(customerGuid, dto);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Validation error: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating appointment: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while creating the appointment" });
        }
    }

    [HttpGet("customer")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetCustomerAppointments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            // Get customer ID from JWT token
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerId) || !Guid.TryParse(customerId, out var customerGuid))
            {
                return Unauthorized("Unable to identify customer");
            }
            

            var result = await _appointmentService.GetAppointmentsByCustomerAsync(customerGuid, page, pageSize);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching appointments: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching appointments" });
        }
    }

    // ============ STAFF/ADMIN ENDPOINTS ============

    [HttpGet("all")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetAllAppointments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _appointmentService.GetAllAppointmentsAsync(page, pageSize);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching all appointments: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching appointments" });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> UpdateAppointmentStatus(Guid id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _appointmentService.UpdateAppointmentStatusAsync(id, dto.Status);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Validation error: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating appointment status: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while updating the appointment status" });
        }
    }
}
