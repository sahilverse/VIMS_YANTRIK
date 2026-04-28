using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class VendorRepository : GenericRepository<Vendor>, IVendorRepository
    {
        public VendorRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<Vendor> Items, int TotalCount)> GetPagedVendorsAsync(int pageNumber, int pageSize, string? search)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(v => 
                    v.CompanyName.ToLower().Contains(search) || 
                    v.ContactPerson!.ToLower().Contains(search) || 
                    v.Email!.ToLower().Contains(search));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(v => v.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
