using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly SalesService _salesService;
        private readonly ILogger<SalesController> _logger;

        public SalesController(SalesService salesService, ILogger<SalesController> logger)
        {
            _salesService = salesService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new sale invoice
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> CreateSaleInvoice([FromBody] CreateSaleInvoiceDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid input", errors = ModelState.Values.SelectMany(v => v.Errors) });

                var result = await _salesService.CreateSaleInvoice(dto);
                return Ok(new { success = true, message = "Sale invoice created successfully", data = result });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Invalid operation: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating sale invoice: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all sale invoices with pagination
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> GetSaleInvoices(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            try
            {
                if (page < 1 || pageSize < 1)
                    return BadRequest(new { success = false, message = "Page and pageSize must be greater than 0" });

                var result = await _salesService.GetSaleInvoices(page, pageSize, search);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sale invoices: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get sale invoice details
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> GetSaleInvoiceDetail(Guid id)
        {
            try
            {
                var result = await _salesService.GetSaleInvoiceDetail(id);
                return Ok(new { success = true, data = result });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Sale invoice not found: {ex.Message}");
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sale invoice detail: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Send invoice email to customer
        /// </summary>
        [HttpPost("{id}/send-email")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> SendInvoiceEmail(Guid id, [FromBody] SendInvoiceEmailDto dto)
        {
            try
            {
                await _salesService.SendInvoiceEmail(id, dto.Email);
                return Ok(new { success = true, message = "Invoice email sent successfully" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Invalid operation: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending invoice email: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Failed to send invoice email", error = ex.Message });
            }
        }
    }
}
