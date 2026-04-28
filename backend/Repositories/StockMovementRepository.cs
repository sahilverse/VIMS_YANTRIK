using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class StockMovementRepository : GenericRepository<StockMovement>, IStockMovementRepository
    {
        public StockMovementRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<StockMovement>> GetByPartIdAsync(Guid partId)
        {
            return await _dbSet
                .Where(sm => sm.PartId == partId)
                .OrderByDescending(sm => sm.CreatedAt)
                .ToListAsync();
        }
    }
}



