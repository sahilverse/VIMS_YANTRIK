using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class PartRequestRepository : GenericRepository<PartRequest>, IPartRequestRepository
    {
        public PartRequestRepository(AppDbContext context) : base(context) { }
    }
}



