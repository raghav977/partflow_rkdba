using backend.Data;
using backend.Model.DTOs;
using backend.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PartRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PartRequestService> _logger;

    public PartRequestService(ApplicationDbContext context, ILogger<PartRequestService> logger)
    {
        _context = context;
        _logger = logger;
    }

   public async Task<GetPartRequestDto> CreateRequestAsync(Guid userId, CreatePartRequestDto dto)
{
    try
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(dto.PartName))
            throw new InvalidOperationException("Part name is required");

        // Get customer from userId
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (customer == null)
            throw new InvalidOperationException("Customer not found");

        var partRequest = new PartRequest
        {
            Id = Guid.NewGuid(),
            CustomerId = customer.Id,
            PartName = dto.PartName,
            Description = dto.Description,
            Status = PartRequestStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.PartRequests.Add(partRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Part request created successfully. ID: {partRequest.Id}");

        return MapToGetDto(partRequest);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating part request");
        throw;
    }
}

    public async Task<PartRequestListResponseDto> GetRequestsByCustomerAsync(
        Guid customerId, int page = 1, int pageSize = 10)
    {
        try
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == customerId);
            if (customer == null)
                throw new InvalidOperationException("Customer not found");
            
            var query = _context.PartRequests
                .Where(pr => pr.CustomerId == customer.Id)
                .OrderByDescending(pr => pr.CreatedAt);

            var total = await query.CountAsync();
            var requests = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var data = requests.Select(MapToGetDto).ToList();

            return new PartRequestListResponseDto
            {
                Total = total,
                Page = page,
                PageSize = pageSize,
                Data = data
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching part requests: {ex.Message}");
            throw;
        }
    }

    private GetPartRequestDto MapToGetDto(PartRequest request)
    {
        return new GetPartRequestDto
        {
            Id = request.Id,
            CustomerId = request.CustomerId,
            PartName = request.PartName,
            Description = request.Description,
            Status = request.Status.ToString(),
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt
        };
    }
}
