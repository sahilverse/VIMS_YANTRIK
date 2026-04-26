using System;
using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public enum InvoiceType { Sale, Purchase }
    public enum PaymentStatus { Paid, Credit, Overdue }

    public class Invoice : BaseEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public InvoiceType Type { get; set; }
        
        public Guid? CustomerId { get; set; }
        public Guid? VendorId { get; set; }
        public Guid StaffId { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public Customer? Customer { get; set; }
        public Vendor? Vendor { get; set; }
        public StaffProfile Staff { get; set; } = null!;
        public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
    }

    public class InvoiceItem : BaseEntity
    {
        public Guid InvoiceId { get; set; }
        public Guid PartId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } 


        public Invoice Invoice { get; set; } = null!;
        public Part Part { get; set; } = null!;
    }
}
