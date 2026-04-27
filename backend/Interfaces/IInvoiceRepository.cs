using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface IInvoiceRepository : IGenericRepository<Invoice>
    {
        Task<Invoice?> GetByIdWithItemsAsync(System.Guid id);
        Task<(IEnumerable<Invoice> Items, int TotalCount)> GetPagedInvoicesAsync(int pageNumber, int pageSize, string? search, InvoiceType? type);
    }
}
