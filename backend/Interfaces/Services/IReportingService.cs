using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IReportingService
    {
        Task<ApiResponse<FinancialReportDto>> GetDailyReportAsync(DateTime date);
        Task<ApiResponse<FinancialReportDto>> GetMonthlyReportAsync(int year, int month);
        Task<ApiResponse<FinancialReportDto>> GetYearlyReportAsync(int year);
        Task<ApiResponse<AdminDashboardStatsDto>> GetAdminDashboardStatsAsync();
    }
}




