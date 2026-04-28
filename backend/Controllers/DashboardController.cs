using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Yantrik.Interfaces.Services;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("staff")]
        public async Task<IActionResult> GetStaffDashboard()
        {
            var response = await _dashboardService.GetStaffDashboardDataAsync();
            return Ok(response);
        }
    }
}
