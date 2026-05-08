using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yantrik.Data;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetCustomerReviewsAsync(Guid userId);
        Task<ReviewDto> SubmitReviewAsync(Guid userId, CreateReviewDto request);
    }

    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReviewDto>> GetCustomerReviewsAsync(Guid userId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null) return Enumerable.Empty<ReviewDto>();

            return await _context.Reviews
                .Where(r => r.CustomerId == customer.Id)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    AppointmentId = r.AppointmentId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ReviewDto> SubmitReviewAsync(Guid userId, CreateReviewDto request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
                throw new Exception("Customer profile not found");

            if (request.AppointmentId.HasValue)
            {
                var appointment = await _context.Appointments
                    .AnyAsync(a => a.Id == request.AppointmentId.Value && a.CustomerId == customer.Id);
                
                if (!appointment)
                    throw new Exception("Appointment not found or does not belong to you");
            }

            var review = new Review
            {
                CustomerId = customer.Id,
                AppointmentId = request.AppointmentId,
                Rating = request.Rating,
                Comment = request.Comment
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                AppointmentId = review.AppointmentId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }
    }
}
