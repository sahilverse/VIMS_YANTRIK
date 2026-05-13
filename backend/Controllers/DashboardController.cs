using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Yantrik.Interfaces.Services;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin,Staff,Customer")]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpGet("staff")]
        public async Task<IActionResult> GetStaffDashboard()
        {
            var response = await _dashboardService.GetStaffDashboardDataAsync();
            return Ok(response);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("customer")]
        public async Task<IActionResult> GetCustomerDashboard()
        {
            var userId = System.Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                ?? throw new System.UnauthorizedAccessException("User ID not found in token"));

            var response = await _dashboardService.GetCustomerDashboardDataAsync(userId);
            return Ok(response);
        }
    }
}
