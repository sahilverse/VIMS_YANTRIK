using System;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IEmployeeRepository Employees { get; private set; }
        public ICustomerRepository Customers { get; private set; }
        public IUserRepository Users { get; private set; }
        public IRefreshTokenRepository RefreshTokens { get; private set; }
        public IVendorRepository Vendors { get; private set; }
        public ICategoryRepository Categories { get; private set; }
        public IPartRepository Parts { get; private set; }
        public IInvoiceRepository Invoices { get; private set; }
        public IVehicleRepository Vehicles { get; private set; }
        public IStockMovementRepository StockMovements { get; private set; }

        public IAppointmentRepository Appointments { get; private set; }
        public IServiceRecordRepository ServiceRecords { get; private set; }
        public IReviewRepository Reviews { get; private set; }
        public IPartRequestRepository PartRequests { get; private set; }
        public INotificationRepository Notifications { get; private set; }
        public IAIPredictionRepository AIPredictions { get; private set; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Employees = new EmployeeRepository(_context);
            Customers = new CustomerRepository(_context);
            Users = new UserRepository(_context);
            RefreshTokens = new RefreshTokenRepository(_context);
            Vendors = new VendorRepository(_context);
            Categories = new CategoryRepository(_context);
            Parts = new PartRepository(_context);
            Invoices = new InvoiceRepository(_context);
            Vehicles = new VehicleRepository(_context);
            StockMovements = new StockMovementRepository(_context);

            Appointments = new AppointmentRepository(_context);
            ServiceRecords = new ServiceRecordRepository(_context);
            Reviews = new ReviewRepository(_context);
            PartRequests = new PartRequestRepository(_context);
            Notifications = new NotificationRepository(_context);
            AIPredictions = new AIPredictionRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_context.Database.CurrentTransaction != null)
            {
                await _context.Database.CurrentTransaction.CommitAsync();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_context.Database.CurrentTransaction != null)
            {
                await _context.Database.CurrentTransaction.RollbackAsync();
            }
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}



