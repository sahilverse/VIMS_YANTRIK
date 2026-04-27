using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<UserDto>> GetProfileAsync(System.Guid id);
        Task<ApiResponse<PagedResponse<UserDto>>> GetPagedStaffAsync(PaginationParams @params);
        Task<ApiResponse<UserDto>> RegisterStaffAsync(StaffRegisterRequest request);
        Task<ApiResponse<UserDto>> RegisterCustomerWithVehicleAsync(CustomerWithVehicleRegisterRequest request);
        Task<ApiResponse<bool>> UpdateStaffAsync(System.Guid id, UpdateStaffRequest request);
        Task<ApiResponse<bool>> ToggleStaffStatusAsync(System.Guid id);
    }
}
