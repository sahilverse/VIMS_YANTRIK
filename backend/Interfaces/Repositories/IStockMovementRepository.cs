using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IStockMovementRepository : IGenericRepository<StockMovement>
    {
        Task<IEnumerable<StockMovement>> GetByPartIdAsync(Guid partId);
    }
}




