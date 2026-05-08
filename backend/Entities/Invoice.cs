using System;
using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Invoice : BaseEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public InvoiceType Type { get; set; }
        
        public Guid? CustomerId { get; set; }
        public Guid? VendorId { get; set; }
        public Guid EmployeeId { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }


        public Customer? Customer { get; set; }
        public Vendor? Vendor { get; set; }
        public Employee Employee { get; set; } = null!;
        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();

    }
}



