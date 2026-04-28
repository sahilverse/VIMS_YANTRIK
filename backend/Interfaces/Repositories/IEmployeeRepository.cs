using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<Employee?> GetByEmployeeCodeAsync(string code);
        Task<IEnumerable<Employee>> GetAllWithUserAsync();
    }
}




