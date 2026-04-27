using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<(IEnumerable<User> Items, int TotalCount)> GetPagedStaffAsync(int pageNumber, int pageSize, string? search);
    }
}
