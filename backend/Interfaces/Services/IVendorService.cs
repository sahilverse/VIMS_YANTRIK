using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IVendorService
    {
        Task<ApiResponse<PagedResponse<VendorDto>>> GetPagedVendorsAsync(PaginationParams @params);
        Task<ApiResponse<VendorDto>> GetVendorByIdAsync(Guid id);
        Task<ApiResponse<VendorDto>> CreateVendorAsync(CreateVendorRequest request);
        Task<ApiResponse<bool>> UpdateVendorAsync(Guid id, CreateVendorRequest request);
        Task<ApiResponse<bool>> DeleteVendorAsync(Guid id);
    }
}




