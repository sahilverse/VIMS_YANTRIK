using System;
using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalStaffCount { get; set; }
        public int TotalVendorCount { get; set; }
        public decimal TodayRevenue { get; set; }
        public int TodaySalesCount { get; set; }
        public int LowStockCount { get; set; }
        public List<DashboardPurchaseDto> RecentPurchases { get; set; } = new();
        public List<DashboardLowStockPartDto> LowStockParts { get; set; } = new();
    }

    public class DashboardPurchaseDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }

    public class DashboardLowStockPartDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public int MinThreshold { get; set; }
    }
}
