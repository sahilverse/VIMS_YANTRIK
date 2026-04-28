using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IPurchaseService
    {
        Task<ApiResponse<PagedResponse<PurchaseInvoiceDto>>> GetPagedPurchasesAsync(InvoiceQueryParams @params);
        Task<ApiResponse<PurchaseInvoiceDto>> GetPurchaseByIdAsync(Guid id);
        Task<ApiResponse<PurchaseInvoiceDto>> CreatePurchaseAsync(Guid EmployeeId, CreatePurchaseRequest request);
        Task<ApiResponse<PurchaseInvoiceDto>> UpdatePurchaseStatusAsync(Guid id, PaymentStatus status);
    }
}




