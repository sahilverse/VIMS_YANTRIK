using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class ReportingService : IReportingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReportingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<FinancialReportDto>> GetDailyReportAsync(DateTime date)
        {
            var start = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
            var end = start.AddDays(1);

            var invoices = await _unitOfWork.Invoices.Find(i => i.Date >= start && i.Date < end).ToListAsync();
            
            var report = CalculateSummary(invoices);

            // Generate data points for each hour of the day
            report.ChartData = Enumerable.Range(0, 24)
                .Select(hour => 
                {
                    var hourInvoices = invoices.Where(i => i.Date.Hour == hour).ToList();
                    return new ReportDataPoint
                    {
                        Label = $"{hour:00}:00",
                        Revenue = hourInvoices.Where(i => i.Type == InvoiceType.Sale).Sum(i => i.TotalAmount),
                        Expense = hourInvoices.Where(i => i.Type == InvoiceType.Purchase).Sum(i => i.TotalAmount)
                    };
                }).ToList();

            return ApiResponse<FinancialReportDto>.SuccessResponse(report);
        }

        public async Task<ApiResponse<FinancialReportDto>> GetMonthlyReportAsync(int year, int month)
        {
            var start = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var end = start.AddMonths(1);

            var invoices = await _unitOfWork.Invoices.Find(i => i.Date >= start && i.Date < end).ToListAsync();
            
            var report = CalculateSummary(invoices);
            
            // Generate data points for each day of the month
            report.ChartData = Enumerable.Range(1, DateTime.DaysInMonth(year, month))
                .Select(day => 
                {
                    var dayInvoices = invoices.Where(i => i.Date.Day == day).ToList();
                    return new ReportDataPoint
                    {
                        Label = day.ToString(),
                        Revenue = dayInvoices.Where(i => i.Type == InvoiceType.Sale).Sum(i => i.TotalAmount),
                        Expense = dayInvoices.Where(i => i.Type == InvoiceType.Purchase).Sum(i => i.TotalAmount)
                    };
                }).ToList();

            return ApiResponse<FinancialReportDto>.SuccessResponse(report);
        }

        public async Task<ApiResponse<FinancialReportDto>> GetYearlyReportAsync(int year)
        {
            var start = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var end = start.AddYears(1);

            var invoices = await _unitOfWork.Invoices.Find(i => i.Date >= start && i.Date < end).ToListAsync();
            
            var report = CalculateSummary(invoices);

            // Generate data points for each month
            report.ChartData = Enumerable.Range(1, 12)
                .Select(m => 
                {
                    var monthInvoices = invoices.Where(i => i.Date.Month == m).ToList();
                    return new ReportDataPoint
                    {
                        Label = new DateTime(year, m, 1).ToString("MMM"),
                        Revenue = monthInvoices.Where(i => i.Type == InvoiceType.Sale).Sum(i => i.TotalAmount),
                        Expense = monthInvoices.Where(i => i.Type == InvoiceType.Purchase).Sum(i => i.TotalAmount)
                    };
                }).ToList();

            return ApiResponse<FinancialReportDto>.SuccessResponse(report);
        }

        private FinancialReportDto CalculateSummary(IEnumerable<Invoice> invoices)
        {
            var sales = invoices.Where(i => i.Type == InvoiceType.Sale).ToList();
            var purchases = invoices.Where(i => i.Type == InvoiceType.Purchase).ToList();

            return new FinancialReportDto
            {
                TotalRevenue = sales.Sum(s => s.TotalAmount),
                TotalExpense = purchases.Sum(p => p.TotalAmount),
                TotalSalesCount = sales.Count,
                TotalPurchasesCount = purchases.Count
            };
        }
    }
}
