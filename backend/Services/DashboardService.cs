using System;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;
using Yantrik.Interfaces.Services;

namespace Yantrik.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<StaffDashboardDto>> GetStaffDashboardDataAsync()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            // 1. Today's Sales 
            var (todaySales, _) = await _unitOfWork.Invoices.GetPagedInvoicesAsync(
                1, 1000, null, InvoiceType.Sale, today, tomorrow, null);
            
            var todaySalesAmount = todaySales.Sum(i => i.TotalAmount);

            // 2. Parts Sold Today
            var partsSoldToday = todaySales.Sum(i => i.Items.Sum(item => item.Quantity));
            
            // 3. Total Customers
            var totalCustomers = await _unitOfWork.Customers.CountAsync();

            // 4. Active Appointments
            var activeAppointmentsCount = await _unitOfWork.Appointments.CountAsync(a => a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Confirmed);

            // 5. Pending Payments Count
            var (_, pendingCount) = await _unitOfWork.Invoices.GetPagedInvoicesAsync(
                1, 1, null, InvoiceType.Sale, null, null, PaymentStatus.Pending);

            // 6. Recent Sales
            var (recentInvoices, _) = await _unitOfWork.Invoices.GetPagedInvoicesAsync(
                1, 5, null, InvoiceType.Sale, null, null, null);

            var recentSales = recentInvoices.Select(i => new RecentSaleDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                CustomerName = i.Customer?.FullName ?? "Walk-in",
                TotalAmount = i.TotalAmount,
                PaymentStatus = i.PaymentStatus.ToString(),
                Date = i.Date
            }).ToList();

            // 7. Low Stock Alerts
            var lowStockParts = await _unitOfWork.Parts.GetLowStockPartsAsync();
            var lowStockAlerts = lowStockParts.Select(p => new LowStockAlertDto
            {
                PartName = p.Name,
                SKU = p.SKU,
                CurrentStock = p.StockQuantity,
                MinStockLevel = p.MinThreshold
            }).ToList();

            var dashboardData = new StaffDashboardDto
            {
                TodaySales = todaySalesAmount,
                PartsSoldToday = (int)partsSoldToday,
                PendingPaymentsCount = pendingCount,
                TotalCustomers = totalCustomers,
                ActiveAppointmentsCount = activeAppointmentsCount,
                RecentSales = recentSales,
                LowStockAlerts = lowStockAlerts
            };

            return ApiResponse<StaffDashboardDto>.SuccessResponse(dashboardData);
        }
    }
}
