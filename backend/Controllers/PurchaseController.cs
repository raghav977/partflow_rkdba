using backend.Model;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class PurchaseController : ControllerBase
{
    private readonly PurchaseService _purchaseService;
    private readonly ILogger<PurchaseController> _logger;

    public PurchaseController(PurchaseService purchaseService, ILogger<PurchaseController> logger)
    {
        _purchaseService = purchaseService;
        _logger = logger;
    }

    /// <summary>
    /// Create a new purchase invoice for stock updates
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePurchaseInvoice([FromBody] CreatePurchaseInvoiceDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid input",
                    errors = ModelState.Values.SelectMany(v => v.Errors)
                });

            var result = await _purchaseService.CreatePurchaseInvoice(dto);
            return Ok(new { success = true, message = "Purchase invoice created successfully", data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Invalid operation: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating purchase invoice: {ex.Message}");
            return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all purchase invoices with pagination
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetPurchaseInvoices(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        try
        {
            if (page < 1 || pageSize < 1)
                return BadRequest(new { success = false, message = "Page and pageSize must be greater than 0" });

            var result = await _purchaseService.GetPurchaseInvoices(page, pageSize, search);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching purchase invoices: {ex.Message}");
            return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Get purchase invoice details
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetPurchaseInvoiceDetail(Guid id)
    {
        try
        {
            var result = await _purchaseService.GetPurchaseInvoiceById(id);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Purchase invoice not found: {ex.Message}");
            return NotFound(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching purchase invoice detail: {ex.Message}");
            return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Update purchase invoice status
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdatePurchaseInvoiceStatus(Guid id, [FromBody] UpdatePurchaseInvoiceDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest(new { success = false, message = "Status is required" });

            var result = await _purchaseService.UpdatePurchaseInvoiceStatus(id, dto.Status);
            return Ok(new { success = true, message = "Purchase invoice status updated", data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Invalid operation: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating purchase invoice: {ex.Message}");
            return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
        }
    }
}
