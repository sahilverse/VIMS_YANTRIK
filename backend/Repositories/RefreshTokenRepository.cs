using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<RefreshToken?> GetByHashAsync(string hash)
        {
            return await _dbSet
                .Include(r => r.User)
                .ThenInclude(u => u.CustomerProfile)
                .Include(r => r.User)
                .ThenInclude(u => u.StaffProfile)
                .FirstOrDefaultAsync(r => r.TokenHash == hash);
        }
    }
}
