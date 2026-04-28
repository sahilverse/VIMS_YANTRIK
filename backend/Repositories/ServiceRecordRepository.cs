using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class ServiceRecordRepository : GenericRepository<ServiceRecord>, IServiceRecordRepository
    {
        public ServiceRecordRepository(AppDbContext context) : base(context) { }
    }
}



