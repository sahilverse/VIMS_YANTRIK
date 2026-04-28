using System;
using System.Threading.Tasks;

namespace Yantrik.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IEmployeeRepository Employees { get; }
        ICustomerRepository Customers { get; }
        IUserRepository Users { get; }
        IRefreshTokenRepository RefreshTokens { get; }
        IVendorRepository Vendors { get; }
        ICategoryRepository Categories { get; }
        IPartRepository Parts { get; }
        IInvoiceRepository Invoices { get; }
        IVehicleRepository Vehicles { get; }
        IStockMovementRepository StockMovements { get; }
        ILoyaltyTransactionRepository LoyaltyTransactions { get; }
        IAppointmentRepository Appointments { get; }
        IServiceRecordRepository ServiceRecords { get; }
        IReviewRepository Reviews { get; }
        IPartRequestRepository PartRequests { get; }
        INotificationRepository Notifications { get; }
        IAIPredictionRepository AIPredictions { get; }
        
        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}



