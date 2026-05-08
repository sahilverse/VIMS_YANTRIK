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
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<Customer> Items, int TotalCount)> GetPagedCustomersAsync(int pageNumber, int pageSize, string? search)
        {
            var query = _dbSet.Include(c => c.Vehicles).Include(c => c.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(c => 
                    c.FullName.ToLower().Contains(search) || 
                    c.Phone.Contains(search) || 
                    c.CustomerCode.ToLower().Contains(search) ||
                    c.Vehicles.Any(v => 
                        v.PlateNumber.ToLower().Contains(search) ||
                        (v.Brand != null && v.Brand.ToLower().Contains(search)) ||
                        (v.Model != null && v.Model.ToLower().Contains(search)) ||
                        (v.VIN != null && v.VIN.ToLower().Contains(search))
                    ));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Customer?> GetCustomerWithDetailsAsync(Guid id)
        {
            return await _dbSet
                .Include(c => c.Vehicles)
                .Include(c => c.User)
                .Include(c => c.Invoices)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> IsPhoneUniqueAsync(string phone)
        {
            return !await _dbSet.AnyAsync(c => c.Phone == phone);
        }

        public async Task<bool> IsPlateNumberUniqueAsync(string plateNumber)
        {
            return !await _context.Set<Vehicle>().AnyAsync(v => v.PlateNumber == plateNumber);
        }
    }
}



