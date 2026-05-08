using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdWithProfileAsync(Guid id)
        {
            return await _dbSet
                .Include(u => u.Employee)
                .Include(u => u.CustomerProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedEmployeesAsync(int pageNumber, int pageSize, string? search)
        {
            var query = _dbSet
                .Include(u => u.Employee)
                .Where(u => u.Employee != null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(u => 
                    u.Email!.ToLower().Contains(search) || 
                    u.Employee!.FullName.ToLower().Contains(search) ||
                    u.Employee!.EmployeeCode.ToLower().Contains(search) ||
                    (u.Employee!.Phone != null && u.Employee!.Phone.ToLower().Contains(search)));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(u => u.Employee!.EmployeeCode)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}



