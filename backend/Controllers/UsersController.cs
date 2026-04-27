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
            var userId = System.Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                ?? throw new System.UnauthorizedAccessException("User ID not found in token"));

            var response = await _userService.GetProfileAsync(userId);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] StaffRegisterRequest request)
        {
            var response = await _userService.RegisterStaffAsync(request);
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

        [Authorize(Roles = "Admin")]
        [HttpGet("staff")]
        public async Task<IActionResult> GetStaff([FromQuery] PaginationParams @params)
        {
            var response = await _userService.GetPagedStaffAsync(@params);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("staff/{id}")]
        public async Task<IActionResult> UpdateStaff(System.Guid id, [FromBody] UpdateStaffRequest request)
        {
            var response = await _userService.UpdateStaffAsync(id, request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("staff/{id}/toggle-status")]
        public async Task<IActionResult> ToggleStaffStatus(System.Guid id)
        {
            var response = await _userService.ToggleStaffStatusAsync(id);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
