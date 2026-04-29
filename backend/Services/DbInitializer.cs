using backend.Data;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DbInitializer
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<DbInitializer> _logger;

    public DbInitializer(ApplicationDbContext db, ILogger<DbInitializer> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        try
        {
            // Ensure database is created
            await _db.Database.MigrateAsync();

            // Seed admin user if none exists
            await SeedAdminUserAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during database initialization");
            throw;
        }
    }

    private async Task SeedAdminUserAsync()
    {
        try
        {
            // Check if admin already exists
            var adminExists = await _db.Users.AnyAsync(u => u.Role == UserRole.Admin);

            if (!adminExists)
            {
                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Name = "Admin",
                    Email = "admin@partflow.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _db.Users.Add(adminUser);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Admin user seeded successfully");
            }
            else
            {
                _logger.LogInformation("Admin user already exists");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding admin user");
            throw;
        }
    }
}
