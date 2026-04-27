using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _config;

        public AuthController(IAuthService authService, IConfiguration config)
        {
            _authService = authService;
            _config = config;
        }

        // Public: Customer Self-Registration
        [HttpPost("self-register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            if (!response.Success)
                return BadRequest(response);

            SetRefreshTokenCookie(response.Data!.RefreshToken);
            return Ok(response);
        }

        // Staff/Admin Only: Register walk-in customer with vehicle
        [Authorize(Roles = "Admin,Staff")]
        [HttpPost("register-customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] CustomerWithVehicleRegisterRequest request)
        {
            var response = await _authService.RegisterCustomerWithVehicleAsync(request);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        // Admin Only: Register new Staff or Admin
        [Authorize(Roles = "Admin")]
        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] StaffRegisterRequest request)
        {
            var response = await _authService.RegisterStaffAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if (!response.Success)
                return Unauthorized(response);

            SetRefreshTokenCookie(response.Data!.RefreshToken);
            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(ApiResponse<AuthResponse>.FailureResponse("Refresh token is missing"));

            var response = await _authService.RefreshTokenAsync(refreshToken);
            if (!response.Success)
                return BadRequest(response);

            SetRefreshTokenCookie(response.Data!.RefreshToken);
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.LogoutAsync(refreshToken);
            }

            Response.Cookies.Delete("refreshToken");
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Logged out successfully"));
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var expiryDays = double.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? throw new InvalidOperationException("JWT Refresh Token Expiry is missing."));
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, 
                SameSite = SameSiteMode.None, 
                Expires = System.DateTime.UtcNow.AddDays(expiryDays) 
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
