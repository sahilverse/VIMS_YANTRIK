using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class InvoiceRepository : GenericRepository<Invoice>, IInvoiceRepository
    {
        public InvoiceRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Invoice?> GetByIdWithItemsAsync(Guid id)
        {
            return await _dbSet
                .Include(i => i.Items)
                    .ThenInclude(it => it.Part)
                .Include(i => i.Vendor)
                .Include(i => i.Customer)
                    .ThenInclude(c => c.User)
                .Include(i => i.Employee)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<(IEnumerable<Invoice> Items, int TotalCount)> GetPagedInvoicesAsync(
            int pageNumber, 
            int pageSize, 
            string? search, 
            InvoiceType? type,
            DateTime? startDate = null,
            DateTime? endDate = null,
            PaymentStatus? status = null)
        {
            var query = _dbSet
                .Include(i => i.Items)
                .Include(i => i.Vendor)
                .Include(i => i.Customer)
                    .ThenInclude(c => c.User)
                .Include(i => i.Employee)
                .AsQueryable();

            if (type.HasValue)
            {
                query = query.Where(i => i.Type == type.Value);
            }

            if (status.HasValue)
            {
                query = query.Where(i => i.PaymentStatus == status.Value);
            }

            if (startDate.HasValue)
            {
                var start = DateTime.SpecifyKind(startDate.Value.Date, DateTimeKind.Utc);
                query = query.Where(i => i.Date >= start);
            }

            if (endDate.HasValue)
            {
                var end = DateTime.SpecifyKind(endDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
                query = query.Where(i => i.Date <= end);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(i => 
                    i.InvoiceNumber.ToLower().Contains(search) || 
                    (i.Vendor != null && i.Vendor.CompanyName.ToLower().Contains(search)) ||
                    (i.Customer != null && i.Customer.FullName.ToLower().Contains(search)));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(i => i.Date)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}



