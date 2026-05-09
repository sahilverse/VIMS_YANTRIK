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
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ReviewDto>>>> GetMyReviews()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var reviews = await _reviewService.GetCustomerReviewsAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReviewDto>>.SuccessResponse(reviews, "Reviews retrieved successfully"));
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> SubmitReview([FromBody] CreateReviewDto request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var review = await _reviewService.SubmitReviewAsync(userId, request);
                return Ok(ApiResponse<ReviewDto>.SuccessResponse(review, "Review submitted successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<ReviewDto>.FailureResponse(ex.Message));
            }
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ReviewDto>>>> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(ApiResponse<IEnumerable<ReviewDto>>.SuccessResponse(reviews, "All reviews retrieved"));
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpDelete("staff/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(Guid id)
        {
            var success = await _reviewService.DeleteReviewAsync(id);
            if (!success)
                return NotFound(ApiResponse<bool>.FailureResponse("Review not found"));

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Review deleted successfully"));
        }
    }
}
