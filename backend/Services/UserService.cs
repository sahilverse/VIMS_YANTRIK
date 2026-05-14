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

        public async Task<ApiResponse<UserDto>> RegisterEmployeeAsync(EmployeeRegisterRequest request)
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
                Employee = new Employee
                {
                    EmployeeCode = await _sequenceService.GetNextCodeAsync(SequenceType.Employee),
                    FullName = request.FullName,
                    Phone = request.Phone
                }
            };

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var result = await _userManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<UserDto>.FailureResponse("Employee registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));
                }

                var roleResult = await _userManager.AddToRoleAsync(user, request.Role.ToString());
                if (!roleResult.Succeeded)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<UserDto>.FailureResponse("Failed to assign role", roleResult.Errors.ToDictionary(e => e.Code, e => e.Description));
                }

                await _unitOfWork.CommitTransactionAsync();

                // Send welcome email in background
                Hangfire.BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.Employee.FullName, tempPassword));

                return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, request.Role.ToString()), "Employee created successfully. Welcome email sent.");
            }
            catch (System.Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<UserDto>.FailureResponse($"Error during employee registration: {ex.Message}");
            }
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
                            Brand = request.Brand,
                            Model = request.Model,
                            Year = request.Year
                        }
                    }
                }
            };

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var result = await _userManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<UserDto>.FailureResponse("Customer registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));
                }

                var roleResult = await _userManager.AddToRoleAsync(user, UserRole.Customer.ToString());
                if (!roleResult.Succeeded)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<UserDto>.FailureResponse("Failed to assign customer role", roleResult.Errors.ToDictionary(e => e.Code, e => e.Description));
                }

                await _unitOfWork.CommitTransactionAsync();

                if (!string.IsNullOrEmpty(request.Email))
                {
                    Hangfire.BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.CustomerProfile.FullName, tempPassword));
                }

                return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, UserRole.Customer.ToString()), "Customer created successfully.");
            }
            catch (System.Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<UserDto>.FailureResponse($"Error during customer registration: {ex.Message}");
            }
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
                FullName = user.Employee?.FullName ?? user.CustomerProfile?.FullName ?? "User",
                Role = role,
                ProfileId = user.Employee?.Id ?? user.CustomerProfile?.Id,
                Phone = user.Employee?.Phone ?? user.CustomerProfile?.Phone,
                Code = user.Employee?.EmployeeCode ?? user.CustomerProfile?.CustomerCode,
                IsActive = user.IsActive
            };
        }

        public async Task<ApiResponse<UserDto>> GetProfileAsync(System.Guid id)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(id);
            if (user == null) return ApiResponse<UserDto>.FailureResponse("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            return ApiResponse<UserDto>.SuccessResponse(MapToDto(user, roles.FirstOrDefault() ?? "No Role"));
        }

        public async Task<ApiResponse<PagedResponse<UserDto>>> GetPagedEmployeesAsync(PaginationParams @params)
        {
            var (users, totalCount) = await _unitOfWork.Users.GetPagedEmployeesAsync(@params.PageNumber, @params.PageSize, @params.Search);

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FullName = u.Employee?.FullName ?? string.Empty,
                Role = _userManager.GetRolesAsync(u).Result.FirstOrDefault() ?? "Staff",
                ProfileId = u.Employee?.Id,
                Phone = u.Employee?.Phone,
                Code = u.Employee?.EmployeeCode,
                IsActive = u.IsActive
            });

            var pagedResponse = new PagedResponse<UserDto>(userDtos, totalCount, @params.PageNumber, @params.PageSize);
            return ApiResponse<PagedResponse<UserDto>>.SuccessResponse(pagedResponse);
        }

        public async Task<ApiResponse<bool>> UpdateEmployeeAsync(System.Guid id, UpdateEmployeeRequest request)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(id);
            if (user == null) return ApiResponse<bool>.FailureResponse("Employee not found");

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Update Identity User
                user.Email = request.Email;
                user.UserName = request.Email;
                var userResult = await _userManager.UpdateAsync(user);
                if (!userResult.Succeeded)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<bool>.FailureResponse("Failed to update user identity", 
                        userResult.Errors.ToDictionary(e => e.Code, e => e.Description));
                }

                // Update Roles
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, request.Role.ToString());

                // Update Employee Profile
                if (user.Employee != null)
                {
                    user.Employee.FullName = request.FullName;
                    user.Employee.Phone = request.Phone ?? string.Empty;
                    _unitOfWork.Users.Update(user);
                    await _unitOfWork.CompleteAsync();
                }

                await _unitOfWork.CommitTransactionAsync();
                return ApiResponse<bool>.SuccessResponse(true, "Employee updated successfully");
            }
            catch (System.Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<bool>.FailureResponse($"Error updating employee: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> ToggleEmployeeStatusAsync(System.Guid id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null) return ApiResponse<bool>.FailureResponse("User not found");

            user.IsActive = !user.IsActive;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            string status = user.IsActive ? "activated" : "deactivated";
            return ApiResponse<bool>.SuccessResponse(true, $"User {status} successfully");
        }

        public async Task<ApiResponse<UserProfileDto>> GetCurrentUserProfileAsync(System.Guid userId)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user == null) return ApiResponse<UserProfileDto>.FailureResponse("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "No Role";

            var dto = new UserProfileDto
            {
                UserId = user.Id,
                Email = user.Email!,
                FullName = user.Employee?.FullName ?? user.CustomerProfile?.FullName ?? "User",
                Phone = user.Employee?.Phone ?? user.CustomerProfile?.Phone,
                Address = user.CustomerProfile?.Address,
                Code = user.Employee?.EmployeeCode ?? user.CustomerProfile?.CustomerCode ?? "N/A",
                Role = role
            };

            return ApiResponse<UserProfileDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<bool>> UpdateProfileAsync(System.Guid userId, UpdateProfileRequest request)
        {
            var user = await _unitOfWork.Users.GetByIdWithProfileAsync(userId);
            if (user == null) return ApiResponse<bool>.FailureResponse("User not found");

            if (user.Employee != null)
            {
                user.Employee.FullName = request.FullName;
                user.Employee.Phone = request.Phone;
            }
            else if (user.CustomerProfile != null)
            {
                user.CustomerProfile.FullName = request.FullName;
                user.CustomerProfile.Phone = request.Phone ?? string.Empty;
                user.CustomerProfile.Address = request.Address;
            }
            else
            {
                return ApiResponse<bool>.FailureResponse("No associated profile found to update");
            }

            _unitOfWork.Users.Update(user);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0 
                ? ApiResponse<bool>.SuccessResponse(true, "Profile updated successfully")
                : ApiResponse<bool>.FailureResponse("No changes were made to the profile");
        }
    }
}



