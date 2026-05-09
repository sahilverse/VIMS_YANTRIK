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
    [Route("api/requests")]
    public class PartRequestsController : ControllerBase
    {
        private readonly IPartRequestService _partRequestService;

        public PartRequestsController(IPartRequestService partRequestService)
        {
            _partRequestService = partRequestService;
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<IEnumerable<PartRequestDto>>>> GetMyPartRequests()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var requests = await _partRequestService.GetCustomerRequestsAsync(userId);
            return Ok(ApiResponse<IEnumerable<PartRequestDto>>.SuccessResponse(requests, "Part requests retrieved successfully"));
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<PartRequestDto>>> CreatePartRequest(CreatePartRequestDto request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var partRequest = await _partRequestService.SubmitRequestAsync(userId, request);
                return Ok(ApiResponse<PartRequestDto>.SuccessResponse(partRequest, "Part request submitted successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PartRequestDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<PartRequestDto>>>> GetAllRequests([FromQuery] string? statusFilter)
        {
            var requests = await _partRequestService.GetAllRequestsAsync(statusFilter);
            return Ok(ApiResponse<IEnumerable<PartRequestDto>>.SuccessResponse(requests, "All part requests retrieved"));
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<PartRequestDto>>> UpdateRequestStatus(Guid id, UpdatePartRequestStatusDto request)
        {
            try
            {
                var partRequest = await _partRequestService.UpdateRequestStatusAsync(id, request);
                return Ok(ApiResponse<PartRequestDto>.SuccessResponse(partRequest, "Part request status updated"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<PartRequestDto>.FailureResponse(ex.Message));
            }
        }
    }
}
