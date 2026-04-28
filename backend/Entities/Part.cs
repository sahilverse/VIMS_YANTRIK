using System;
using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Part : BaseEntity
    {
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; } = 10;
        public bool IsActive { get; set; } = true;

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
        public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    }
}



