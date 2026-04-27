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
        IVendorRepository Vendors { get; }
        ICategoryRepository Categories { get; }
        IPartRepository Parts { get; }
        IInvoiceRepository Invoices { get; }
        
        Task<int> CompleteAsync();
    }
}
