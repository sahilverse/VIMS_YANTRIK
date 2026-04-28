using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class StaffDashboardDto
    {
        public decimal TodaySales { get; set; }
        public int PartsSoldToday { get; set; }
        public int PendingPaymentsCount { get; set; }
        public List<RecentSaleDto> RecentSales { get; set; } = new();
        public List<LowStockAlertDto> LowStockAlerts { get; set; } = new();
    }

    public class RecentSaleDto
    {
        public System.Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public System.DateTime Date { get; set; }
    }

    public class LowStockAlertDto
    {
        public string PartName { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinStockLevel { get; set; }
    }
}
