using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IInventoryService
    {
        // Category Management
        Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllCategoriesAsync();
        Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request);
        Task<ApiResponse<bool>> UpdateCategoryAsync(Guid id, CreateCategoryRequest request);
        Task<ApiResponse<bool>> DeleteCategoryAsync(Guid id);

        // Part Management
        Task<ApiResponse<PagedResponse<PartDto>>> GetPagedPartsAsync(InventoryPaginationParams @params);
        Task<ApiResponse<PartDto>> GetPartByIdAsync(Guid id);
        Task<ApiResponse<PartDto>> CreatePartAsync(CreatePartRequest request);
        Task<ApiResponse<bool>> UpdatePartAsync(Guid id, CreatePartRequest request);
        Task<ApiResponse<bool>> DeletePartAsync(Guid id);
        Task<ApiResponse<IEnumerable<PartDto>>> GetLowStockPartsAsync();
    }
}




