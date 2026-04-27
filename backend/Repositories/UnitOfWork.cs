using System;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IStaffRepository Staff { get; private set; }
        public ICustomerRepository Customers { get; private set; }
        public IUserRepository Users { get; private set; }
        public IRefreshTokenRepository RefreshTokens { get; private set; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Staff = new StaffRepository(_context);
            Customers = new CustomerRepository(_context);
            Users = new UserRepository(_context);
            RefreshTokens = new RefreshTokenRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
