using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IVehicleService
    {
        Task<ApiResponse<PagedResponse<VehicleDto>>> GetCustomerVehiclesAsync(Guid userId, PaginationParams @params);
        Task<ApiResponse<VehicleDto>> AddVehicleAsync(Guid userId, VehicleRegistrationDto dto);
        Task<ApiResponse<VehicleDto>> UpdateVehicleAsync(Guid userId, Guid vehicleId, VehicleDto dto);
        Task<ApiResponse<bool>> DeleteVehicleAsync(Guid userId, Guid vehicleId);
    }
}
