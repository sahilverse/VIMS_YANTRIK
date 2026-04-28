using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IUserService
    {
        Task<ApiResponse<UserDto>> GetProfileAsync(System.Guid id);
        Task<ApiResponse<PagedResponse<UserDto>>> GetPagedEmployeesAsync(PaginationParams @params);
        Task<ApiResponse<UserDto>> RegisterEmployeeAsync(EmployeeRegisterRequest request);
        Task<ApiResponse<UserDto>> RegisterCustomerWithVehicleAsync(CustomerWithVehicleRegisterRequest request);
        Task<ApiResponse<bool>> UpdateEmployeeAsync(System.Guid id, UpdateEmployeeRequest request);
        Task<ApiResponse<bool>> ToggleEmployeeStatusAsync(System.Guid id);
        Task<ApiResponse<UserProfileDto>> GetCurrentUserProfileAsync(System.Guid userId);
        Task<ApiResponse<bool>> UpdateProfileAsync(System.Guid userId, UpdateProfileRequest request);
    }
}




