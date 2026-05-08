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
    public class VehicleService : IVehicleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VehicleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<PagedResponse<VehicleDto>>> GetCustomerVehiclesAsync(Guid userId, PaginationParams @params)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user?.CustomerProfile == null)
                return ApiResponse<PagedResponse<VehicleDto>>.FailureResponse("Customer profile not found");

            var (items, totalCount) = await _unitOfWork.Vehicles.GetPagedByCustomerIdAsync(
                user.CustomerProfile.Id, 
                @params.PageNumber, 
                @params.PageSize, 
                @params.Search);

            var dtos = items.Select(MapToDto);
            var response = new PagedResponse<VehicleDto>(dtos, totalCount, @params.PageNumber, @params.PageSize);

            return ApiResponse<PagedResponse<VehicleDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<VehicleDto>> AddVehicleAsync(Guid userId, VehicleRegistrationDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user?.CustomerProfile == null)
                return ApiResponse<VehicleDto>.FailureResponse("Customer profile not found");

            var vehicle = new Vehicle
            {
                CustomerId = user.CustomerProfile.Id,
                PlateNumber = dto.PlateNumber,
                Brand = dto.Brand,
                Model = dto.Model,
                Year = dto.Year,
                VIN = dto.VIN
            };

            await _unitOfWork.Vehicles.AddAsync(vehicle);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<VehicleDto>.SuccessResponse(MapToDto(vehicle), "Vehicle added successfully");
        }

        public async Task<ApiResponse<VehicleDto>> UpdateVehicleAsync(Guid userId, Guid vehicleId, VehicleDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user?.CustomerProfile == null)
                return ApiResponse<VehicleDto>.FailureResponse("Customer profile not found");

            var vehicle = await _unitOfWork.Vehicles.GetByIdAsync(vehicleId);
            if (vehicle == null || vehicle.CustomerId != user.CustomerProfile.Id)
                return ApiResponse<VehicleDto>.FailureResponse("Vehicle not found or unauthorized");

            vehicle.PlateNumber = dto.PlateNumber;
            vehicle.Brand = dto.Brand;
            vehicle.Model = dto.Model;
            vehicle.Year = dto.Year;
            vehicle.VIN = dto.VIN;

            _unitOfWork.Vehicles.Update(vehicle);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<VehicleDto>.SuccessResponse(MapToDto(vehicle), "Vehicle updated successfully");
        }

        public async Task<ApiResponse<bool>> DeleteVehicleAsync(Guid userId, Guid vehicleId)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user?.CustomerProfile == null)
                return ApiResponse<bool>.FailureResponse("Customer profile not found");

            var vehicle = await _unitOfWork.Vehicles.GetByIdAsync(vehicleId);
            if (vehicle == null || vehicle.CustomerId != user.CustomerProfile.Id)
                return ApiResponse<bool>.FailureResponse("Vehicle not found or unauthorized");

            _unitOfWork.Vehicles.Remove(vehicle);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Vehicle removed successfully");
        }

        private VehicleDto MapToDto(Vehicle v) => new VehicleDto
        {
            Id = v.Id,
            PlateNumber = v.PlateNumber,
            Brand = v.Brand,
            Model = v.Model,
            Year = v.Year,
            VIN = v.VIN
        };
    }
}
