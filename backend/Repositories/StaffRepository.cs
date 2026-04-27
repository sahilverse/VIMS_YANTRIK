using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class StaffRepository : GenericRepository<StaffProfile>, IStaffRepository
    {
        public StaffRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<StaffProfile?> GetByEmployeeCodeAsync(string code)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.EmployeeCode == code);
        }

        public async Task<IEnumerable<StaffProfile>> GetAllWithUserAsync()
        {
            return await _dbSet
                .Include(s => s.User)
                .ToListAsync();
        }
    }
}
