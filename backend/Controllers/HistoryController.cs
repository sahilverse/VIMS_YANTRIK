using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Services;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<HistoryPagedResult>>> GetMyHistory(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? type,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var filter = new HistoryFilterDto
            {
                StartDate = startDate,
                EndDate = endDate,
                Type = type,
                Search = search,
                Page = page,
                PageSize = pageSize
            };
            var result = await _historyService.GetCustomerTimelineAsync(userId, filter);
            return Ok(ApiResponse<HistoryPagedResult>.SuccessResponse(result, "History retrieved successfully"));
        }
    }
}
