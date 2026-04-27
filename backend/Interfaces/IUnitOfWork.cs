using System;
using System.Threading.Tasks;

namespace Yantrik.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IStaffRepository Staff { get; }
        ICustomerRepository Customers { get; }
        IUserRepository Users { get; }
        IRefreshTokenRepository RefreshTokens { get; }
        
        Task<int> CompleteAsync();
    }
}
