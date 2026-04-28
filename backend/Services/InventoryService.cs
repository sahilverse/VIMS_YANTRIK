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
    public class InventoryService : IInventoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public InventoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region Category Management
        public async Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            var dtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            });
            return ApiResponse<IEnumerable<CategoryDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request)
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description
            };
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto { Id = category.Id, Name = category.Name, Description = category.Description });
        }

        public async Task<ApiResponse<bool>> UpdateCategoryAsync(Guid id, CreateCategoryRequest request)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return ApiResponse<bool>.FailureResponse("Category not found");

            category.Name = request.Name;
            category.Description = request.Description;
            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Category updated successfully");
        }

        public async Task<ApiResponse<bool>> DeleteCategoryAsync(Guid id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return ApiResponse<bool>.FailureResponse("Category not found");

            _unitOfWork.Categories.Remove(category);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Category deleted successfully");
        }
        #endregion

        #region Part Management
        public async Task<ApiResponse<PagedResponse<PartDto>>> GetPagedPartsAsync(InventoryPaginationParams @params)
        {
            var (parts, totalCount) = await _unitOfWork.Parts.GetPagedPartsAsync(@params.PageNumber, @params.PageSize, @params.Search, @params.CategoryId);

            var dtos = parts.Select(p => new PartDto
            {
                Id = p.Id,
                SKU = p.SKU,
                Name = p.Name,
                Brand = p.Brand,
                Description = p.Description,
                UnitPrice = p.UnitPrice,
                CostPrice = p.CostPrice,
                StockQuantity = p.StockQuantity,
                MinThreshold = p.MinThreshold,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "Uncategorized"
            });

            var response = new PagedResponse<PartDto>(dtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<PartDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<PartDto>> GetPartByIdAsync(Guid id)
        {
            var part = await _unitOfWork.Parts.GetByIdAsync(id);
            if (part == null) return ApiResponse<PartDto>.FailureResponse("Part not found");

            var dto = new PartDto
            {
                Id = part.Id,
                SKU = part.SKU,
                Name = part.Name,
                Brand = part.Brand,
                Description = part.Description,
                UnitPrice = part.UnitPrice,
                CostPrice = part.CostPrice,
                StockQuantity = part.StockQuantity,
                MinThreshold = part.MinThreshold,
                IsActive = part.IsActive,
                CategoryId = part.CategoryId
            };
            return ApiResponse<PartDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<PartDto>> CreatePartAsync(CreatePartRequest request)
        {
            var part = new Part
            {
                SKU = request.SKU,
                Name = request.Name,
                Brand = request.Brand,
                Description = request.Description,
                UnitPrice = request.UnitPrice,
                CostPrice = request.CostPrice,
                StockQuantity = request.StockQuantity,
                MinThreshold = request.MinThreshold,
                CategoryId = request.CategoryId
            };

            await _unitOfWork.Parts.AddAsync(part);
            await _unitOfWork.CompleteAsync();

            return await GetPartByIdAsync(part.Id);
        }

        public async Task<ApiResponse<bool>> UpdatePartAsync(Guid id, CreatePartRequest request)
        {
            var part = await _unitOfWork.Parts.GetByIdAsync(id);
            if (part == null) return ApiResponse<bool>.FailureResponse("Part not found");

            part.SKU = request.SKU;
            part.Name = request.Name;
            part.Brand = request.Brand;
            part.Description = request.Description;
            part.UnitPrice = request.UnitPrice;
            part.CostPrice = request.CostPrice;
            part.StockQuantity = request.StockQuantity;
            part.MinThreshold = request.MinThreshold;
            part.CategoryId = request.CategoryId;

            _unitOfWork.Parts.Update(part);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Part updated successfully");
        }

        public async Task<ApiResponse<bool>> DeletePartAsync(Guid id)
        {
            var part = await _unitOfWork.Parts.GetByIdAsync(id);
            if (part == null) return ApiResponse<bool>.FailureResponse("Part not found");

            _unitOfWork.Parts.Remove(part);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Part deleted successfully");
        }

        public async Task<ApiResponse<IEnumerable<PartDto>>> GetLowStockPartsAsync()
        {
            var parts = await _unitOfWork.Parts.GetLowStockPartsAsync();
            var dtos = parts.Select(p => new PartDto
            {
                Id = p.Id,
                SKU = p.SKU,
                Name = p.Name,
                StockQuantity = p.StockQuantity,
                MinThreshold = p.MinThreshold,
                CategoryName = p.Category?.Name ?? "Uncategorized"
            });
            return ApiResponse<IEnumerable<PartDto>>.SuccessResponse(dtos);
        }
        #endregion
    }
}



