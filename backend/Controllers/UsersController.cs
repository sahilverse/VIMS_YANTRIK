using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = GetUserId();
            var response = await _userService.GetProfileAsync(userId);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var response = await _userService.GetCurrentUserProfileAsync(userId);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = GetUserId();
            var response = await _userService.UpdateProfileAsync(userId, request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        private System.Guid GetUserId()
        {
            return System.Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                ?? throw new System.UnauthorizedAccessException("User ID not found in token"));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("employee")]
        public async Task<IActionResult> RegisterEmployee([FromBody] EmployeeRegisterRequest request)
        {
            var response = await _userService.RegisterEmployeeAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpPost("customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] CustomerWithVehicleRegisterRequest request)
        {
            var response = await _userService.RegisterCustomerWithVehicleAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees([FromQuery] PaginationParams @params)
        {
            var response = await _userService.GetPagedEmployeesAsync(@params);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("employee/{id}")]
        public async Task<IActionResult> UpdateEmployee(System.Guid id, [FromBody] UpdateEmployeeRequest request)
        {
            var response = await _userService.UpdateEmployeeAsync(id, request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("employee/{id}/toggle-status")]
        public async Task<IActionResult> ToggleEmployeeStatus(System.Guid id)
        {
            var response = await _userService.ToggleEmployeeStatusAsync(id);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}



