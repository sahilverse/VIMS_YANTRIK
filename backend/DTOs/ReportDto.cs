using System;
using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class FinancialReportDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal NetProfit => TotalRevenue - TotalExpense;
        public int TotalSalesCount { get; set; }
        public int TotalPurchasesCount { get; set; }
        public List<ReportDataPoint> ChartData { get; set; } = new();
    }

    public class ReportDataPoint
    {
        public string Label { get; set; } = string.Empty; // Date or Month name
        public decimal Revenue { get; set; }
        public decimal Expense { get; set; }
    }
}



