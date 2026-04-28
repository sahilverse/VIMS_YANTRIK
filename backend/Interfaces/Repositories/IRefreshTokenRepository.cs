using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetByHashAsync(string hash);
    }
}




