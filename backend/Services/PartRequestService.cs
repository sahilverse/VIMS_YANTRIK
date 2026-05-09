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
    public class PartRequestService : IPartRequestService
    {
        private readonly AppDbContext _context;

        public PartRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PartRequestDto>> GetCustomerRequestsAsync(Guid userId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null) return Enumerable.Empty<PartRequestDto>();

            return await _context.PartRequests
                .Include(pr => pr.Part)
                .Where(pr => pr.CustomerId == customer.Id)
                .OrderByDescending(pr => pr.CreatedAt)
                .Select(pr => new PartRequestDto
                {
                    Id = pr.Id,
                    CustomerId = pr.CustomerId,
                    CustomerName = customer.FullName,
                    PartId = pr.PartId,
                    PartName = pr.Part.Name,
                    PartSKU = pr.Part.SKU,
                    Notes = pr.Notes,
                    Status = pr.Status.ToString(),
                    CreatedAt = pr.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PartRequestDto>> GetAllRequestsAsync(string? statusFilter = null)
        {
            var query = _context.PartRequests
                .Include(pr => pr.Part)
                .Include(pr => pr.Customer)
                .AsQueryable();

            if (!string.IsNullOrEmpty(statusFilter))
            {
                if (Enum.TryParse<PartRequestStatus>(statusFilter, true, out var statusEnum))
                {
                    query = query.Where(pr => pr.Status == statusEnum);
                }
            }

            return await query
                .OrderByDescending(pr => pr.CreatedAt)
                .Select(pr => new PartRequestDto
                {
                    Id = pr.Id,
                    CustomerId = pr.CustomerId,
                    CustomerName = pr.Customer.FullName,
                    PartId = pr.PartId,
                    PartName = pr.Part.Name,
                    PartSKU = pr.Part.SKU,
                    Notes = pr.Notes,
                    Status = pr.Status.ToString(),
                    CreatedAt = pr.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<PartRequestDto> SubmitRequestAsync(Guid userId, CreatePartRequestDto request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
                throw new Exception("Customer profile not found");

            var part = await _context.Parts.FindAsync(request.PartId);
            if (part == null)
                throw new Exception("Part not found");

            // Optional: validate if it's really out of stock, but sometimes users request anyway if they need bulk.
            // We'll trust the frontend for out-of-stock visibility, or staff can cancel it.
            
            // Check if already requested and pending to avoid spam
            var existingRequest = await _context.PartRequests
                .FirstOrDefaultAsync(pr => pr.CustomerId == customer.Id && pr.PartId == request.PartId && pr.Status == PartRequestStatus.Pending);

            if (existingRequest != null)
                throw new Exception("You already have a pending request for this part.");

            var partRequest = new PartRequest
            {
                CustomerId = customer.Id,
                PartId = request.PartId,
                Notes = request.Notes,
                Status = PartRequestStatus.Pending
            };

            _context.PartRequests.Add(partRequest);
            await _context.SaveChangesAsync();

            return new PartRequestDto
            {
                Id = partRequest.Id,
                CustomerId = partRequest.CustomerId,
                CustomerName = customer.FullName,
                PartId = partRequest.PartId,
                PartName = part.Name,
                PartSKU = part.SKU,
                Notes = partRequest.Notes,
                Status = partRequest.Status.ToString(),
                CreatedAt = partRequest.CreatedAt
            };
        }

        public async Task<PartRequestDto> UpdateRequestStatusAsync(Guid requestId, UpdatePartRequestStatusDto request)
        {
            var partRequest = await _context.PartRequests
                .Include(pr => pr.Part)
                .Include(pr => pr.Customer)
                .FirstOrDefaultAsync(pr => pr.Id == requestId);

            if (partRequest == null)
                throw new Exception("Part request not found");

            if (!Enum.TryParse<PartRequestStatus>(request.Status, true, out var statusEnum))
                throw new Exception("Invalid status");

            partRequest.Status = statusEnum;
            await _context.SaveChangesAsync();

            return new PartRequestDto
            {
                Id = partRequest.Id,
                CustomerId = partRequest.CustomerId,
                CustomerName = partRequest.Customer.FullName,
                PartId = partRequest.PartId,
                PartName = partRequest.Part.Name,
                PartSKU = partRequest.Part.SKU,
                Notes = partRequest.Notes,
                Status = partRequest.Status.ToString(),
                CreatedAt = partRequest.CreatedAt
            };
        }
    }
}
