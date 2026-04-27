using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetVendors([FromQuery] PaginationParams @params)
        {
            var response = await _vendorService.GetPagedVendorsAsync(@params);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVendor(Guid id)
        {
            var response = await _vendorService.GetVendorByIdAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVendor([FromBody] CreateVendorRequest request)
        {
            var response = await _vendorService.CreateVendorAsync(request);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVendor(Guid id, [FromBody] CreateVendorRequest request)
        {
            var response = await _vendorService.UpdateVendorAsync(id, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendor(Guid id)
        {
            var response = await _vendorService.DeleteVendorAsync(id);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
    }
}
