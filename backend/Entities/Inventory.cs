using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Vendor : BaseEntity
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }

    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        public ICollection<Part> Parts { get; set; } = new List<Part>();
    }

    public class Part : BaseEntity
    {
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; } = 10;

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
    }
}
