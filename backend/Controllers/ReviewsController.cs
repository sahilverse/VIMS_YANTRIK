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
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("my")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ReviewDto>>>> GetMyReviews()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var reviews = await _reviewService.GetCustomerReviewsAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReviewDto>>.SuccessResponse(reviews, "Reviews retrieved successfully"));
        }

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
    }
}
