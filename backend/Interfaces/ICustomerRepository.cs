using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<(IEnumerable<Customer> Items, int TotalCount)> GetPagedCustomersAsync(int pageNumber, int pageSize, string? search);
        Task<Customer?> GetCustomerWithDetailsAsync(Guid id);
        Task<bool> IsPhoneUniqueAsync(string phone);
        Task<bool> IsPlateNumberUniqueAsync(string plateNumber);
    }
}
