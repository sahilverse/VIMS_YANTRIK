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
    public class VehicleRepository : GenericRepository<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Vehicle>> GetByCustomerIdAsync(Guid customerId)
        {
            return await _dbSet
                .Where(v => v.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Vehicle> Items, int TotalCount)> GetPagedByCustomerIdAsync(Guid customerId, int pageNumber, int pageSize, string? search)
        {
            var query = _dbSet.Where(v => v.CustomerId == customerId).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                query = query.Where(v => 
                    v.PlateNumber.ToLower().Contains(s) || 
                    (v.VIN != null && v.VIN.ToLower().Contains(s)) ||
                    (v.Brand != null && v.Brand.ToLower().Contains(s)) ||
                    (v.Model != null && v.Model.ToLower().Contains(s))
                );
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(v => v.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Vehicle?> GetByPlateNumberAsync(string plateNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(v => v.PlateNumber == plateNumber);
        }
    }
}



