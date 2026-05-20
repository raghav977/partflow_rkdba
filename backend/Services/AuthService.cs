using backend.Data;
using backend.Model;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AuthService
{
    private readonly ApplicationDbContext _db;
    private readonly JwtTokenService _jwtTokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ApplicationDbContext db,
        JwtTokenService jwtTokenService,
        ILogger<AuthService> logger)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        try
        {
            // Find user by email
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                _logger.LogWarning($"Login attempt with non-existent email: {dto.Email}");
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Check if user is active
            if (!user.IsActive)
            {
                _logger.LogWarning($"Login attempt by inactive user: {dto.Email}");
                throw new UnauthorizedAccessException("User account is inactive");
            }

            // Verify password using BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                _logger.LogWarning($"Failed login attempt for user: {dto.Email}");
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Generate JWT token
            string token = _jwtTokenService.GenerateToken(user);

            _logger.LogInformation($"Successful login for user: {dto.Email}");

            return new LoginResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role.ToString(),
                UserId = user.Id.ToString(),
                Name = user.Name
            };
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            throw new Exception("An error occurred during login. Please try again.", ex);
        }
    }
}
