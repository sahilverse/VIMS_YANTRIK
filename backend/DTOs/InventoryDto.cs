using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;

namespace Yantrik.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class PartDto
    {
        public Guid Id { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }

    public class CreatePartRequest
    {
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; } = 10;
        public Guid CategoryId { get; set; }
    }

    public class InventoryPaginationParams : PaginationParams
    {
        public Guid? CategoryId { get; set; }
    }
}
