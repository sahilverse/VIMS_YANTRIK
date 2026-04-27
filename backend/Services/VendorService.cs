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
    public class VendorService : IVendorService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VendorService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<PagedResponse<VendorDto>>> GetPagedVendorsAsync(PaginationParams @params)
        {
            var (vendors, totalCount) = await _unitOfWork.Vendors.GetPagedVendorsAsync(@params.PageNumber, @params.PageSize, @params.Search);

            var vendorDtos = vendors.Select(v => new VendorDto
            {
                Id = v.Id,
                CompanyName = v.CompanyName,
                ContactPerson = v.ContactPerson,
                Email = v.Email,
                Phone = v.Phone,
                Address = v.Address
            });

            var pagedResponse = new PagedResponse<VendorDto>(vendorDtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<VendorDto>>.SuccessResponse(pagedResponse);
        }

        public async Task<ApiResponse<VendorDto>> GetVendorByIdAsync(Guid id)
        {
            var vendor = await _unitOfWork.Vendors.GetByIdAsync(id);
            if (vendor == null) return ApiResponse<VendorDto>.FailureResponse("Vendor not found");

            var dto = new VendorDto
            {
                Id = vendor.Id,
                CompanyName = vendor.CompanyName,
                ContactPerson = vendor.ContactPerson,
                Email = vendor.Email,
                Phone = vendor.Phone,
                Address = vendor.Address
            };

            return ApiResponse<VendorDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<VendorDto>> CreateVendorAsync(CreateVendorRequest request)
        {
            var vendor = new Vendor
            {
                CompanyName = request.CompanyName,
                ContactPerson = request.ContactPerson,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address
            };

            await _unitOfWork.Vendors.AddAsync(vendor);
            await _unitOfWork.CompleteAsync();

            var dto = new VendorDto
            {
                Id = vendor.Id,
                CompanyName = vendor.CompanyName,
                ContactPerson = vendor.ContactPerson,
                Email = vendor.Email,
                Phone = vendor.Phone,
                Address = vendor.Address
            };

            return ApiResponse<VendorDto>.SuccessResponse(dto, "Vendor created successfully");
        }

        public async Task<ApiResponse<bool>> UpdateVendorAsync(Guid id, CreateVendorRequest request)
        {
            var vendor = await _unitOfWork.Vendors.GetByIdAsync(id);
            if (vendor == null) return ApiResponse<bool>.FailureResponse("Vendor not found");

            vendor.CompanyName = request.CompanyName;
            vendor.ContactPerson = request.ContactPerson;
            vendor.Email = request.Email;
            vendor.Phone = request.Phone;
            vendor.Address = request.Address;

            _unitOfWork.Vendors.Update(vendor);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Vendor updated successfully");
        }

        public async Task<ApiResponse<bool>> DeleteVendorAsync(Guid id)
        {
            var vendor = await _unitOfWork.Vendors.GetByIdAsync(id);
            if (vendor == null) return ApiResponse<bool>.FailureResponse("Vendor not found");

            _unitOfWork.Vendors.Remove(vendor);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Vendor deleted successfully");
        }
    }
}
