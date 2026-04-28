using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IVendorRepository : IGenericRepository<Vendor>
    {
        Task<(IEnumerable<Vendor> Items, int TotalCount)> GetPagedVendorsAsync(int pageNumber, int pageSize, string? search);
    }
}




