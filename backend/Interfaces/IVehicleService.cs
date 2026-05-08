using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IVehicleService
    {
        Task<ApiResponse<IEnumerable<VehicleDto>>> GetCustomerVehiclesAsync(Guid userId);
        Task<ApiResponse<VehicleDto>> AddVehicleAsync(Guid userId, VehicleRegistrationDto dto);
        Task<ApiResponse<VehicleDto>> UpdateVehicleAsync(Guid userId, Guid vehicleId, VehicleDto dto);
        Task<ApiResponse<bool>> DeleteVehicleAsync(Guid userId, Guid vehicleId);
    }
}
