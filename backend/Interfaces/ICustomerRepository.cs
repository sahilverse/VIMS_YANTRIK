using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<Customer?> GetByCodeAsync(string code);
        Task<IEnumerable<Customer>> GetAllWithVehiclesAsync();
    }
}
