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
        private readonly ISequenceService _sequenceService;
        private readonly IEmailService _emailService;

        public UserService(
            IUnitOfWork unitOfWork, 
            UserManager<User> userManager,
            ISequenceService sequenceService,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _sequenceService = sequenceService;
            _emailService = emailService;
        }

        public async Task<ApiResponse<UserDto>> RegisterStaffAsync(StaffRegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                return ApiResponse<UserDto>.FailureResponse("Email is already registered");

            var tempPassword = GenerateRandomPassword();

            var user = new User
            {
                Email = request.Email,
                UserName = request.Email,
                MustChangePassword = true,
                StaffProfile = new StaffProfile
                {
                    EmployeeCode = await _sequenceService.GetNextCodeAsync(SequenceType.Staff),
                    FullName = request.FullName,
                    Phone = request.Phone
                }
            };

            var result = await _userManager.CreateAsync(user, tempPassword);
            if (!result.Succeeded)
                return ApiResponse<UserDto>.FailureResponse("Staff registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));

            await _userManager.AddToRoleAsync(user, request.Role.ToString());

            // Send welcome email in background
            Hangfire.BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.StaffProfile.FullName, tempPassword));

            return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, request.Role.ToString()), "Staff member created successfully. Welcome email sent.");
        }

        public async Task<ApiResponse<UserDto>> RegisterCustomerWithVehicleAsync(CustomerWithVehicleRegisterRequest request)
        {
            var tempPassword = GenerateRandomPassword();
            var email = request.Email ?? $"{request.Phone}@vims.temp";

            var userExists = await _userManager.FindByEmailAsync(email);
            if (userExists != null)
                return ApiResponse<UserDto>.FailureResponse("A user with this email or phone already exists");

            var user = new User
            {
                Email = email,
                UserName = email,
                MustChangePassword = true,
                CustomerProfile = new Customer
                {
                    CustomerCode = await _sequenceService.GetNextCodeAsync(SequenceType.Customer),
                    FullName = request.FullName,
                    Phone = request.Phone,
                    Address = request.Address,
                    Vehicles = new System.Collections.Generic.List<Vehicle>
                    {
                        new Vehicle
                        {
                            PlateNumber = request.PlateNumber,
                            Make = request.Make,
                            Model = request.Model,
                            Year = request.Year
                        }
                    }
                }
            };

            var result = await _userManager.CreateAsync(user, tempPassword);
            if (!result.Succeeded)
                return ApiResponse<UserDto>.FailureResponse("Customer registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));

            await _userManager.AddToRoleAsync(user, UserRole.Customer.ToString());

            if (!string.IsNullOrEmpty(request.Email))
            {
                Hangfire.BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.CustomerProfile.FullName, tempPassword));
            }

            return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, UserRole.Customer.ToString()), "Customer created successfully.");
        }

        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new System.Random();
            return new string(System.Linq.Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray()) + "1aA!";
        }

        private UserDto MapToDto(User user, string role)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.StaffProfile?.FullName ?? user.CustomerProfile?.FullName ?? "User",
                Role = role,
                Phone = user.StaffProfile?.Phone ?? user.CustomerProfile?.Phone,
                Code = user.StaffProfile?.EmployeeCode ?? user.CustomerProfile?.CustomerCode
            };
        }

        public async Task<ApiResponse<UserDto>> GetProfileAsync(System.Guid id)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(id);
            if (user == null) return ApiResponse<UserDto>.FailureResponse("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, roles.FirstOrDefault() ?? "No Role"));
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
                Phone = u.StaffProfile?.Phone,
                Code = u.StaffProfile?.EmployeeCode
            });

            var pagedResponse = new PagedResponse<UserDto>(userDtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<UserDto>>.SuccessResponse(pagedResponse);
        }

        public async Task<ApiResponse<bool>> UpdateStaffAsync(System.Guid id, UpdateStaffRequest request)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(id);
            if (user == null) return ApiResponse<bool>.FailureResponse("Staff member not found");

            // Update Identity User
            user.Email = request.Email;
            user.UserName = request.Email;
            var userResult = await _userManager.UpdateAsync(user);
            if (!userResult.Succeeded)
                return ApiResponse<bool>.FailureResponse("Failed to update user identity", 
                    userResult.Errors.ToDictionary(e => e.Code, e => e.Description));

            // Update Roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, request.Role.ToString());

            // Update Staff Profile
            if (user.StaffProfile != null)
            {
                user.StaffProfile.FullName = request.FullName;
                user.StaffProfile.Phone = request.Phone ?? string.Empty;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.CompleteAsync();
            }

            return ApiResponse<bool>.SuccessResponse(true, "Staff member updated successfully");
        }

        public async Task<ApiResponse<bool>> ToggleStaffStatusAsync(System.Guid id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null) return ApiResponse<bool>.FailureResponse("User not found");

            user.IsActive = !user.IsActive;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            string status = user.IsActive ? "activated" : "deactivated";
            return ApiResponse<bool>.SuccessResponse(true, $"User {status} successfully");
        }
    }
}
