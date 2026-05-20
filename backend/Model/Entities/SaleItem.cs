using System;

namespace backend.Model.Entities
{
    public class SaleItem
    {
        public Guid Id { get; set; }
        public Guid SaleInvoiceId { get; set; }
        public Guid PartId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public SaleInvoice? SaleInvoice { get; set; }
        public Part? Part { get; set; }
    }
}
