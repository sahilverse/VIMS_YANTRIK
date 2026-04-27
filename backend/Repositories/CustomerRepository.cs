using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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

        public async Task<Customer?> GetByCodeAsync(string code)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.CustomerCode == code);
        }

        public async Task<IEnumerable<Customer>> GetAllWithVehiclesAsync()
        {
            return await _dbSet
                .Include(c => c.Vehicles)
                .ToListAsync();
        }
    }
}
