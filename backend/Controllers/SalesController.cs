using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces.Services;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISalesService _salesService;

        public SalesController(ISalesService salesService)
        {
            _salesService = salesService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var response = await _salesService.GetStaffSalesStatsAsync();
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetSales([FromQuery] InvoiceQueryParams queryParams)
        {
            var response = await _salesService.GetPagedSalesAsync(queryParams);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSale(Guid id)
        {
            var response = await _salesService.GetSaleByIdAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] CreateSaleRequest request)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? throw new UnauthorizedAccessException("User ID not found in token"));

            var response = await _salesService.CreateSaleAsync(userId, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdatePurchaseStatusRequest request)
        {
            var response = await _salesService.UpdateSaleStatusAsync(id, request.Status);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
    }
}
