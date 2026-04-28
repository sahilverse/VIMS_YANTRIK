using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface IDashboardService
    {
        Task<ApiResponse<StaffDashboardDto>> GetStaffDashboardDataAsync();
    }
}
