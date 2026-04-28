using System;
using System.Collections.Generic;
using Yantrik.Entities;

namespace Yantrik.DTOs
{
    public class PurchaseInvoiceDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public Guid VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public int ItemCount { get; set; }
        public List<PurchaseItemDto> Items { get; set; } = new();
    }

    public class PurchaseItemDto
    {
        public Guid PartId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total => Quantity * UnitPrice;
    }

    public class CreatePurchaseRequest
    {
        public Guid VendorId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public PaymentStatus PaymentStatus { get; set; }
        public List<CreatePurchaseItemRequest> Items { get; set; } = new();
    }

    public class CreatePurchaseItemRequest
    {
        public Guid PartId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}



