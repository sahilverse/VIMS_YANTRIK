using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Services
{
    public interface ISalesService
    {
        Task<ApiResponse<PagedResponse<SaleInvoiceDto>>> GetPagedSalesAsync(InvoiceQueryParams @params);
        Task<ApiResponse<SaleInvoiceDto>> GetSaleByIdAsync(Guid id);
        Task<ApiResponse<SaleInvoiceDto>> CreateSaleAsync(Guid staffUserId, CreateSaleRequest request);
        Task<ApiResponse<SaleInvoiceDto>> UpdateSaleStatusAsync(Guid id, PaymentStatus status);
        Task<ApiResponse<StaffSalesStatsDto>> GetStaffSalesStatsAsync();
    }
}
