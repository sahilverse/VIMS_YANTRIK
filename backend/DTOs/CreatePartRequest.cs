using System;

namespace Yantrik.DTOs
{
    public class CreatePartRequest
    {
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; } = 10;
        public Guid CategoryId { get; set; }
    }
}



