using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Yantrik.Data;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public IQueryable<T> Find(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.AnyAsync(expression);
        }
        
        public async Task<int> CountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbSet.CountAsync(expression);
        }
    }
}



