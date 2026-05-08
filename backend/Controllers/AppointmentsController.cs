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
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AppointmentDto>>>> GetMyAppointments()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appointments = await _appointmentService.GetCustomerAppointmentsAsync(userId);
            return Ok(ApiResponse<IEnumerable<AppointmentDto>>.SuccessResponse(appointments, "Appointments retrieved successfully"));
        }

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

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> CancelAppointment(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _appointmentService.CancelAppointmentAsync(userId, id);
            if (!success)
                return BadRequest(ApiResponse<bool>.FailureResponse("Could not cancel appointment. It might be already processed or not yours."));

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Appointment cancelled successfully"));
        }

        [HttpGet("part-requests")]
        public async Task<ActionResult<ApiResponse<IEnumerable<PartRequestDto>>>> GetMyPartRequests()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var requests = await _appointmentService.GetCustomerPartRequestsAsync(userId);
            return Ok(ApiResponse<IEnumerable<PartRequestDto>>.SuccessResponse(requests, "Part requests retrieved successfully"));
        }

        [HttpPost("part-requests")]
        public async Task<ActionResult<ApiResponse<PartRequestDto>>> CreatePartRequest(CreatePartRequestDto request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var partRequest = await _appointmentService.CreatePartRequestAsync(userId, request);
                return Ok(ApiResponse<PartRequestDto>.SuccessResponse(partRequest, "Part request submitted successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PartRequestDto>.FailureResponse(ex.Message));
            }
        }
    }
}
