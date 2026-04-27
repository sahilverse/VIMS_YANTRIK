using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Yantrik.Common;
using Yantrik.Data;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly ISequenceService _sequenceService;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public AuthService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            ITokenService tokenService,
            ISequenceService sequenceService,
            IEmailService emailService,
            IUnitOfWork unitOfWork,
            IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _sequenceService = sequenceService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _config = config;
        }

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                return ApiResponse<AuthResponse>.FailureResponse("Email is already registered");

            var user = new User
            {
                Email = request.Email,
                UserName = request.Email,
                CustomerProfile = new Customer
                {
                    CustomerCode = await _sequenceService.GetNextCodeAsync(SequenceType.Customer),
                    FullName = request.FullName,
                    Phone = request.Phone ?? string.Empty,
                    Address = request.Address
                }
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                return ApiResponse<AuthResponse>.FailureResponse("Registration failed", errors);
            }

            await _userManager.AddToRoleAsync(user, UserRole.Customer.ToString());

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> RegisterCustomerWithVehicleAsync(CustomerWithVehicleRegisterRequest request)
        {
            var tempPassword = GenerateRandomPassword();
            var email = request.Email ?? $"{request.Phone}@vims.temp";

            var userExists = await _userManager.FindByEmailAsync(email);
            if (userExists != null)
                return ApiResponse<AuthResponse>.FailureResponse("A user with this email or phone already exists");

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
                    Vehicles = new List<Vehicle>
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
                return ApiResponse<AuthResponse>.FailureResponse("Registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));

            await _userManager.AddToRoleAsync(user, UserRole.Customer.ToString());

            if (!string.IsNullOrEmpty(request.Email))
            {
                BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.CustomerProfile.FullName, tempPassword));
            }

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> RegisterStaffAsync(StaffRegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                return ApiResponse<AuthResponse>.FailureResponse("Email is already registered");

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
                return ApiResponse<AuthResponse>.FailureResponse("Registration failed", result.Errors.ToDictionary(e => e.Code, e => e.Description));

            await _userManager.AddToRoleAsync(user, request.Role.ToString());

            BackgroundJob.Enqueue<IEmailService>(x => x.SendWelcomeEmailAsync(user.Email, user.StaffProfile.FullName, tempPassword));

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var user = await _unitOfWork.Users.Find(u => u.Email == request.Email)
                .Include(u => u.CustomerProfile)
                .Include(u => u.StaffProfile)
                .FirstOrDefaultAsync();

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password");

            if (!user.IsActive)
                return ApiResponse<AuthResponse>.FailureResponse("Your account is deactivated. Please contact support.");

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(string refreshToken)
        {
            var hashedToken = _tokenService.HashToken(refreshToken);
            
            var tokenRecord = await _unitOfWork.RefreshTokens.GetByHashAsync(hashedToken);

            if (tokenRecord == null || tokenRecord.IsRevoked || tokenRecord.ExpiryDate <= DateTime.UtcNow)
                return ApiResponse<AuthResponse>.FailureResponse("Your session has expired. Please login again.");

            tokenRecord.IsRevoked = true;
            _unitOfWork.RefreshTokens.Update(tokenRecord);

            return await GenerateAuthResponseAsync(tokenRecord.User);
        }

        public async Task<ApiResponse<bool>> LogoutAsync(string refreshToken)
        {
            var hashedToken = _tokenService.HashToken(refreshToken);
            var tokenRecord = await _unitOfWork.RefreshTokens.Find(r => r.TokenHash == hashedToken).FirstOrDefaultAsync();
            
            if (tokenRecord != null)
            {
                tokenRecord.IsRevoked = true;
                _unitOfWork.RefreshTokens.Update(tokenRecord);
                await _unitOfWork.CompleteAsync();
            }
            return ApiResponse<bool>.SuccessResponse(true, "Logged out successfully");
        }

        private async Task<ApiResponse<AuthResponse>> GenerateAuthResponseAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var hashedRefreshToken = _tokenService.HashToken(refreshToken);

            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = hashedRefreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(double.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? throw new InvalidOperationException("JWT Refresh Token Expiry is missing."))),
                IsRevoked = false
            };

            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
            await _unitOfWork.CompleteAsync();

            var response = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Expiry = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "15")),
                MustChangePassword = user.MustChangePassword,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.CustomerProfile?.FullName ?? user.StaffProfile?.FullName ?? "User",
                    Role = roles.FirstOrDefault() ?? "No Role",
                    Code = user.StaffProfile?.EmployeeCode ?? user.CustomerProfile?.CustomerCode
                }
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response, "Authenticated successfully");
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<bool>.FailureResponse("User not found");

            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
            if (!passwordCheck)
                return ApiResponse<bool>.FailureResponse("Current password is incorrect",
                    new Dictionary<string, string> { { "currentPassword", "Current password is incorrect" } });

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
                return ApiResponse<bool>.FailureResponse("Password change failed",
                    result.Errors.ToDictionary(e => e.Code, e => e.Description));

            user.MustChangePassword = false;
            await _userManager.UpdateAsync(user);

            return ApiResponse<bool>.SuccessResponse(true, "Password changed successfully");
        }

        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray()) + "1aA!";
        }
    }
}
