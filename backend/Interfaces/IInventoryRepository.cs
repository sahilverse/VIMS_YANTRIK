using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
    }

    public interface IPartRepository : IGenericRepository<Part>
    {
        Task<(IEnumerable<Part> Items, int TotalCount)> GetPagedPartsAsync(int pageNumber, int pageSize, string? search, System.Guid? categoryId);
        Task<IEnumerable<Part>> GetLowStockPartsAsync();
    }
}
