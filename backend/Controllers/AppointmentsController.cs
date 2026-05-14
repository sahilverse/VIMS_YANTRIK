using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AppointmentDto>>>> GetMyAppointments()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appointments = await _appointmentService.GetCustomerAppointmentsAsync(userId);
            return Ok(ApiResponse<IEnumerable<AppointmentDto>>.SuccessResponse(appointments, "Appointments retrieved successfully"));
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> BookAppointment(BookAppointmentRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var appointment = await _appointmentService.BookAppointmentAsync(userId, request);
                return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment booked successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AppointmentDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Customer")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateAppointment(Guid id, BookAppointmentRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var appointment = await _appointmentService.UpdateAppointmentAsync(userId, id, request);
                return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AppointmentDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Customer")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> CancelAppointment(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _appointmentService.CancelAppointmentAsync(userId, id);
            if (!success)
                return BadRequest(ApiResponse<bool>.FailureResponse("Could not cancel appointment. It might be already processed or not yours."));

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Appointment cancelled successfully"));
        }


        [Authorize(Roles = "Admin,Staff")]
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<AppointmentDto>>>> GetAllAppointments([FromQuery] string? statusFilter)
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync(statusFilter);
            return Ok(ApiResponse<IEnumerable<AppointmentDto>>.SuccessResponse(appointments, "All appointments retrieved"));
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> UpdateAppointmentStatus(Guid id, [FromBody] UpdateAppointmentStatusDto request)
        {
            try
            {
                var appointment = await _appointmentService.UpdateAppointmentStatusAsync(id, request.Status);
                return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment status updated"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AppointmentDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpPost("{id}/complete")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> CompleteAppointment(Guid id, [FromBody] CompleteAppointmentRequest request)
        {
            try
            {
                var appointment = await _appointmentService.CompleteAppointmentAsync(id, request);
                return Ok(ApiResponse<AppointmentDto>.SuccessResponse(appointment, "Appointment completed and service record created"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<AppointmentDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpDelete("staff/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteAppointment(Guid id)
        {
            var success = await _appointmentService.DeleteAppointmentAsync(id);
            if (!success)
                return NotFound(ApiResponse<bool>.FailureResponse("Appointment not found"));

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Appointment deleted successfully"));
        }
    }
}
