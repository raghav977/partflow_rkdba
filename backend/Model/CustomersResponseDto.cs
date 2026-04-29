namespace backend.Model;

public class CustomerResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public class CustomersListResponseDto
{
    public int TotalCustomers { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public required List<CustomerResponseDto> Data { get; set; }
}
