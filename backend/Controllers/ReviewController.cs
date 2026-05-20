using backend.Model.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewServiceImpl _reviewService;
    private readonly ILogger<ReviewsController> _logger;

    public ReviewsController(ReviewServiceImpl reviewService, ILogger<ReviewsController> logger)
    {
        _reviewService = reviewService;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
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

            var result = await _reviewService.CreateReviewAsync(customerGuid, dto);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning($"Validation error: {ex.Message}");
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating review: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while creating the review" });
        }
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllReviews()
    {
        try
        {
            var result = await _reviewService.GetReviewsAsync();
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching reviews: {ex.Message}");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching reviews" });
        }
    }
}
