using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;

        public UserService(IUnitOfWork unitOfWork, UserManager<User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<ApiResponse<PagedResponse<UserDto>>> GetPagedStaffAsync(PaginationParams @params)
        {
            var (users, totalCount) = await _unitOfWork.Users.GetPagedStaffAsync(@params.PageNumber, @params.PageSize, @params.Search);

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FullName = u.StaffProfile?.FullName ?? string.Empty,
                Role = _userManager.GetRolesAsync(u).Result.FirstOrDefault() ?? "Staff",
                Code = u.StaffProfile?.EmployeeCode
            });

            var pagedResponse = new PagedResponse<UserDto>(userDtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<UserDto>>.SuccessResponse(pagedResponse);
        }
    }
}
