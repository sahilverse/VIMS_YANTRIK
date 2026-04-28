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

        public async Task<Vehicle?> GetByPlateNumberAsync(string plateNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(v => v.PlateNumber == plateNumber);
        }
    }
}



