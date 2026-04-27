using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces
{
    public interface IStaffRepository : IGenericRepository<StaffProfile>
    {
        Task<StaffProfile?> GetByEmployeeCodeAsync(string code);
        Task<IEnumerable<StaffProfile>> GetAllWithUserAsync();
    }
}
