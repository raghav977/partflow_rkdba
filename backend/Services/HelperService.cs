using System;
using backend.Data;

namespace backend;

public class HelperService
{
    private readonly ApplicationDbContext _dbContext;
    public HelperService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public Guid getCustomerIdFromUserId(Guid userId)
    {


        var customer = _dbContext.Customers.FirstOrDefault(c => c.UserId == userId);
        if (customer == null)
        {
            throw new InvalidOperationException("Customer not found for the given user ID.");
        }

        return customer.Id;
    }

}
