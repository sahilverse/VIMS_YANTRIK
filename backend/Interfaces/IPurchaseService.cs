using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IPurchaseService
    {
        Task<ApiResponse<PagedResponse<PurchaseInvoiceDto>>> GetPagedPurchasesAsync(PaginationParams @params);
        Task<ApiResponse<PurchaseInvoiceDto>> GetPurchaseByIdAsync(Guid id);
        Task<ApiResponse<PurchaseInvoiceDto>> CreatePurchaseAsync(Guid staffId, CreatePurchaseRequest request);
    }
}
