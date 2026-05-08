using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Repositories
{
    public interface IVehicleRepository : IGenericRepository<Vehicle>
    {
        Task<IEnumerable<Vehicle>> GetByCustomerIdAsync(Guid customerId);
        Task<(IEnumerable<Vehicle> Items, int TotalCount)> GetPagedByCustomerIdAsync(Guid customerId, int pageNumber, int pageSize, string? search);
        Task<Vehicle?> GetByPlateNumberAsync(string plateNumber);
    }
}




