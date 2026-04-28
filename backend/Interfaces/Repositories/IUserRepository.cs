using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdWithProfileAsync(Guid id);
        Task<(IEnumerable<User> Items, int TotalCount)> GetPagedEmployeesAsync(int pageNumber, int pageSize, string? search);
    }
}




