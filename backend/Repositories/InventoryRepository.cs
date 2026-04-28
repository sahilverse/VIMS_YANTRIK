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
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }
    }

    public class PartRepository : GenericRepository<Part>, IPartRepository
    {
        public PartRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<Part> Items, int TotalCount)> GetPagedPartsAsync(int pageNumber, int pageSize, string? search, Guid? categoryId)
        {
            var query = _dbSet.Include(p => p.Category).AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(search) || 
                    p.SKU.ToLower().Contains(search) || 
                    p.Description!.ToLower().Contains(search));
            }

            var totalCount = await query.CountAsync();
            
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<IEnumerable<Part>> GetLowStockPartsAsync()
        {
            return await _dbSet
                .Include(p => p.Category)
                .Where(p => p.StockQuantity <= p.MinThreshold)
                .ToListAsync();
        }
    }
}
