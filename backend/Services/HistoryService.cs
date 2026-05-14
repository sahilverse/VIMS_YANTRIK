using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yantrik.Data;
using Yantrik.DTOs;
using Yantrik.Entities;

namespace Yantrik.Services
{
    public interface IHistoryService
    {
        Task<HistoryPagedResult> GetCustomerTimelineAsync(Guid id, HistoryFilterDto filter, bool isUserId = true);
    }

    public class HistoryFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Type { get; set; }
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class HistoryPagedResult
    {
        public List<HistoryItemDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

    public class HistoryService : IHistoryService
    {
        private readonly AppDbContext _context;

        public HistoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<HistoryPagedResult> GetCustomerTimelineAsync(Guid id, HistoryFilterDto filter, bool isUserId = true)
        {
            var customer = isUserId 
                ? await _context.Customers.FirstOrDefaultAsync(c => c.UserId == id)
                : await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
                return new HistoryPagedResult { Page = filter.Page, PageSize = filter.PageSize };

            // Normalize dates to UTC 
            if (filter.StartDate.HasValue)
                filter.StartDate = DateTime.SpecifyKind(filter.StartDate.Value, DateTimeKind.Utc);
            if (filter.EndDate.HasValue)
                filter.EndDate = DateTime.SpecifyKind(filter.EndDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);

            var historyItems = new List<HistoryItemDto>();

            // Get Invoices (skip if type filter is "Service")
            if (string.IsNullOrEmpty(filter.Type) || filter.Type.Equals("Invoice", StringComparison.OrdinalIgnoreCase))
            {
                var invoiceQuery = _context.Invoices
                    .Include(i => i.Items)
                        .ThenInclude(ii => ii.Part)
                    .Where(i => i.CustomerId == customer.Id);

                if (filter.StartDate.HasValue)
                    invoiceQuery = invoiceQuery.Where(i => i.Date >= filter.StartDate.Value);
                if (filter.EndDate.HasValue)
                    invoiceQuery = invoiceQuery.Where(i => i.Date <= filter.EndDate.Value);
                if (!string.IsNullOrEmpty(filter.Search))
                    invoiceQuery = invoiceQuery.Where(i => i.InvoiceNumber.Contains(filter.Search));

                var invoiceEntities = await invoiceQuery
                    .OrderByDescending(i => i.Date)
                    .ToListAsync();

                foreach (var i in invoiceEntities)
                {
                    historyItems.Add(new HistoryItemDto
                    {
                        Id = i.Id,
                        Title = $"Invoice {i.InvoiceNumber}",
                        Description = $"{i.Type} payment of Rs. {i.TotalAmount:N2}",
                        Type = "Invoice",
                        Date = i.Date,
                        Status = i.PaymentStatus.ToString(),
                        Amount = i.TotalAmount,
                        ReferenceNumber = i.InvoiceNumber,
                        SubTotal = i.SubTotal,
                        TaxAmount = i.TaxAmount,
                        LineItems = i.Items.Select(ii => new HistoryLineItemDto
                        {
                            PartName = ii.Part?.Name ?? "Unknown Item",
                            Quantity = ii.Quantity,
                            UnitPrice = ii.UnitPrice
                        }).ToList()
                    });
                }
            }

            // Get Service Records 
            if (string.IsNullOrEmpty(filter.Type) || filter.Type.Equals("Service", StringComparison.OrdinalIgnoreCase))
            {
                var serviceQuery = _context.ServiceRecords
                    .Include(sr => sr.Appointment)
                    .Where(sr => sr.Appointment.CustomerId == customer.Id);

                if (filter.StartDate.HasValue)
                    serviceQuery = serviceQuery.Where(sr => sr.CreatedAt >= filter.StartDate.Value);
                if (filter.EndDate.HasValue)
                    serviceQuery = serviceQuery.Where(sr => sr.CreatedAt <= filter.EndDate.Value);
                if (!string.IsNullOrEmpty(filter.Search))
                    serviceQuery = serviceQuery.Where(sr => 
                        sr.ServiceType.Contains(filter.Search) || 
                        (sr.Description != null && sr.Description.Contains(filter.Search)) ||
                        (sr.Appointment.Vehicle.PlateNumber != null && sr.Appointment.Vehicle.PlateNumber.Contains(filter.Search)) ||
                        (sr.Appointment.Vehicle.Brand != null && sr.Appointment.Vehicle.Brand.Contains(filter.Search)) ||
                        (sr.Appointment.Vehicle.Model != null && sr.Appointment.Vehicle.Model.Contains(filter.Search)));

                var serviceRecords = await serviceQuery
                    .OrderByDescending(sr => sr.CreatedAt)
                    .Select(sr => new HistoryItemDto
                    {
                        Id = sr.AppointmentId,
                        Title = sr.ServiceType,
                        Description = sr.Description ?? "No details provided",
                        Type = "Service",
                        Date = sr.CreatedAt,
                        Status = "Completed",
                        Amount = sr.Cost,
                        ReferenceNumber = "SRV-" + sr.AppointmentId.ToString().Substring(0, 8).ToUpper(),
                        PlateNumber = sr.Appointment.Vehicle.PlateNumber,
                        VehicleBrand = sr.Appointment.Vehicle.Brand,
                        VehicleModel = sr.Appointment.Vehicle.Model
                    })
                    .ToListAsync();

                historyItems.AddRange(serviceRecords);
            }

            // Sort combined results
            var sorted = historyItems.OrderByDescending(h => h.Date).ToList();
            var totalCount = sorted.Count;

            // Paginate
            var paged = sorted
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return new HistoryPagedResult
            {
                Items = paged,
                TotalCount = totalCount,
                Page = filter.Page,
                PageSize = filter.PageSize
            };
        }
    }
}
