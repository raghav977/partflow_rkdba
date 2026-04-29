using System;
using System.Collections.Generic;

namespace backend.Model.Entities
{
    public class SaleInvoice
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid VehicleId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public Customer? Customer { get; set; }
        public Vehicle? Vehicle { get; set; }
        public ICollection<SaleItem>? SaleItems { get; set; }
    }
}
