using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            ITokenService tokenService,
            AppDbContext context,
            IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _context = context;
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
                    FullName = request.FullName,
                    Phone = request.Phone ?? string.Empty
                }
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                return ApiResponse<AuthResponse>.FailureResponse("Registration failed", errors);
            }

            await _userManager.AddToRoleAsync(user, "Customer");

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.CustomerProfile)
                .Include(u => u.StaffProfile)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password");

            if (!user.IsActive)
                return ApiResponse<AuthResponse>.FailureResponse("Your account is deactivated. Please contact support.");

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(string refreshToken)
        {
            var hashedToken = _tokenService.HashToken(refreshToken);
            
            var tokenRecord = await _context.RefreshTokens
                .Include(r => r.User)
                .ThenInclude(u => u.CustomerProfile)
                .Include(r => r.User)
                .ThenInclude(u => u.StaffProfile)
                .FirstOrDefaultAsync(r => r.TokenHash == hashedToken);

            if (tokenRecord == null || tokenRecord.IsRevoked || tokenRecord.ExpiryDate <= DateTime.UtcNow)
                return ApiResponse<AuthResponse>.FailureResponse("Your session has expired. Please login again.");

            // Mark old token as revoked
            tokenRecord.IsRevoked = true;
            _context.RefreshTokens.Update(tokenRecord);

            return await GenerateAuthResponseAsync(tokenRecord.User);
        }

        public async Task<ApiResponse<bool>> LogoutAsync(string refreshToken)
        {
            var hashedToken = _tokenService.HashToken(refreshToken);
            var tokenRecord = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == hashedToken);
            
            if (tokenRecord != null)
            {
                tokenRecord.IsRevoked = true;
                _context.RefreshTokens.Update(tokenRecord);
                await _context.SaveChangesAsync();
            }
            return ApiResponse<bool>.SuccessResponse(true, "Logged out successfully");
        }

        private async Task<ApiResponse<AuthResponse>> GenerateAuthResponseAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var hashedRefreshToken = _tokenService.HashToken(refreshToken);

            // Store hashed refresh token
            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = hashedRefreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(double.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? "7")),
                IsRevoked = false
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            var response = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Expiry = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "15")),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.CustomerProfile?.FullName ?? user.StaffProfile?.FullName ?? "User",
                    Role = roles.FirstOrDefault() ?? "No Role"
                }
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response, "Authenticated successfully");
        }
    }
}
