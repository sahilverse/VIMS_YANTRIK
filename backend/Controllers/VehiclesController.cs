using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyVehicles([FromQuery] PaginationParams @params)
        {
            var userId = GetUserId();
            var response = await _vehicleService.GetCustomerVehiclesAsync(userId, @params);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost]
        public async Task<IActionResult> AddVehicle([FromBody] VehicleRegistrationDto dto)
        {
            var userId = GetUserId();
            var response = await _vehicleService.AddVehicleAsync(userId, dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(Guid id, [FromBody] VehicleDto dto)
        {
            var userId = GetUserId();
            var response = await _vehicleService.UpdateVehicleAsync(userId, id, dto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(Guid id)
        {
            var userId = GetUserId();
            var response = await _vehicleService.DeleteVehicleAsync(userId, id);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        private Guid GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
        }
    }
}
