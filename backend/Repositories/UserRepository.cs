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
                .Include(u => u.StaffProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedStaffAsync(int pageNumber, int pageSize, string? search)
        {
            var query = _dbSet
                .Include(u => u.StaffProfile)
                .Where(u => u.StaffProfile != null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(u => 
                    u.Email!.ToLower().Contains(search) || 
                    u.StaffProfile!.FullName.ToLower().Contains(search) ||
                    u.StaffProfile!.EmployeeCode.ToLower().Contains(search) ||
                    (u.StaffProfile!.Phone != null && u.StaffProfile!.Phone.ToLower().Contains(search)));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(u => u.StaffProfile!.EmployeeCode)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
