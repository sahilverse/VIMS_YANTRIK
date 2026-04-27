using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportingService _reportingService;

        public ReportsController(IReportingService reportingService)
        {
            _reportingService = reportingService;
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyReport([FromQuery] DateTime? date)
        {
            var response = await _reportingService.GetDailyReportAsync(date ?? DateTime.UtcNow);
            return Ok(response);
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReport([FromQuery] int? year, [FromQuery] int? month)
        {
            var now = DateTime.UtcNow;
            var response = await _reportingService.GetMonthlyReportAsync(year ?? now.Year, month ?? now.Month);
            return Ok(response);
        }

        [HttpGet("yearly")]
        public async Task<IActionResult> GetYearlyReport([FromQuery] int? year)
        {
            var now = DateTime.UtcNow;
            var response = await _reportingService.GetYearlyReportAsync(year ?? now.Year);
            return Ok(response);
        }
    }
}
