using System.Security.Claims;
using backend.Model;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(UserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Add a new staff member (Admin only)
    /// </summary>
    [HttpPost("add-staff")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddStaff(AddStaffDTo dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid input",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            await _userService.CreateStaff(dto);

            return Ok(new
            {
                success = true,
                message = "Staff created successfully"
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex.Message);
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating staff");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while creating staff."
            });
        }
    }

    /// <summary>
    /// Get all users with pagination and filtering (Admin and Staff)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Staff")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? role = null,
        [FromQuery] string? search = null)
    {
        try
        {
            // Validate pagination parameters
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Max 100 per page

            var result = await _userService.GetUsers(page, pageSize, role, search);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while fetching users."
            });
        }
    }

    /// <summary>
    /// Get all customers with pagination and filtering (Admin,Staff)
    /// </summary>
    [HttpGet("customers")]
    [Authorize(Roles = "Admin,Staff")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetCustomers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        try
        {
            // Validate pagination parameters
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Max 100 per page

            var result = await _userService.GetCustomers(page, pageSize, search);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customers");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while fetching customers."
            });
        }
    }

    /// <summary>
    /// Advanced customer search by vehicle number, phone, ID, or name (Staff only)
    /// </summary>
    [HttpGet("customers/search")]
    [Authorize(Roles = "Admin,Staff")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> SearchCustomersAdvanced(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? vehicleNumber = null,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] string? customerId = null,
        [FromQuery] string? name = null)
    {
        try
        {
            // Validate pagination parameters
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Max 100 per page

            var result = await _userService.SearchCustomersAdvanced(
                page, pageSize, vehicleNumber, phoneNumber, customerId, name);

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching customers");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while searching customers."
            });
        }
    }

    /// <summary>
    /// Get current user's profile (any authenticated user)
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid token"
                });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    id = userIdClaim,
                    email = emailClaim,
                    role = roleClaim
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching profile");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while fetching profile."
            });
        }
    }

    /// <summary>
    /// Get detailed customer information including vehicles and history (Admin, Staff, Customer)
    /// </summary>
    [HttpGet("customers/{id}")]
    [Authorize(Roles = "Admin,Staff,Customer")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCustomerDetails(Guid id)
    {
        try
        {
            var result = await _userService.GetCustomerDetails(id);
            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex.Message);
            return NotFound(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer details");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while fetching customer details."
            });
        }
    }

    [HttpPost("add-customer")]
    [Authorize(Roles = "Admin,Staff")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddCustomer(AddStaffDTo dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid input",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid token"
            });
        }

        Guid createdByUserId = Guid.Parse(userIdClaim);

            await _userService.CreateCustomer(dto, createdByUserId);

            return Ok(new
            {
                success = true,
                message = "Customer created successfully"
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex.Message);
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Customer");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "An error occurred while creating staff."
            });
        }
    }
}