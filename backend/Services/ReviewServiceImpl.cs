using backend.Data;
using backend.Model.DTOs;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReviewServiceImpl
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ReviewServiceImpl> _logger;

    public ReviewServiceImpl(ApplicationDbContext context, ILogger<ReviewServiceImpl> logger)
    {
        _context = context;
        _logger = logger;
    }

   public async Task<GetReviewDto> CreateReviewAsync(Guid userId, CreateReviewDto dto)
{
    try
    {
        var customer = await _context.Customers
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (customer == null)
            throw new InvalidOperationException("Customer not found");

        var review = new Review
        {
            Id = Guid.NewGuid(),
            CustomerId = customer.Id,   
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Review created successfully. ID: {review.Id}");

        return MapToGetDto(review, customer.User.Name);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating review"); // better logging
        throw;
    }
}
    public async Task<ReviewListResponseDto> GetReviewsAsync()
    {
        try
        {
            var reviews = await _context.Reviews
                .Include(r => r.Customer!)
                .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var total = reviews.Count;
            var data = reviews
                .Select(r => MapToGetDto(r, r.Customer!.User.Name))
                .ToList();

            return new ReviewListResponseDto
            {
                Total = total,
                Data = data
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching reviews: {ex.Message}");
            throw;
        }
    }

    private GetReviewDto MapToGetDto(Review review, string customerName)
    {
        return new GetReviewDto
        {
            Id = review.Id,
            CustomerId = review.CustomerId,
            CustomerName = customerName,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }
}
