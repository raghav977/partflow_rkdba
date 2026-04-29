using backend.Model.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/part-requests")]
[Authorize(Roles = "Customer")]
public class PartRequestsController : ControllerBase
{
    private readonly PartRequestService _partRequestService;
    private readonly ILogger<PartRequestsController> _logger;

    public PartRequestsController(PartRequestService partRequestService, ILogger<PartRequestsController> logger)
    {
        _partRequestService = partRequestService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePartRequest([FromBody] CreatePartRequestDto dto)
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

            var result = await _partRequestService.CreateRequestAsync(customerGuid, dto);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Validation error: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating part request: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while creating the part request" });
        }
    }

    [HttpGet("customer")]
    public async Task<IActionResult> GetCustomerRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            // Get customer ID from JWT token
            var customerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerId) || !Guid.TryParse(customerId, out var customerGuid))
            {
                return Unauthorized("Unable to identify customer");
            }

            var result = await _partRequestService.GetRequestsByCustomerAsync(customerGuid, page, pageSize);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching part requests: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching part requests" });
        }
    }
}
