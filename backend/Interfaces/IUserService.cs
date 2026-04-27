using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<PagedResponse<UserDto>>> GetPagedStaffAsync(PaginationParams @params);
    }
}
