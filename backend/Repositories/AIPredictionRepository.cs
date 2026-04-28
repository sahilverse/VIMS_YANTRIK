using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class AIPredictionRepository : GenericRepository<AIPrediction>, IAIPredictionRepository
    {
        public AIPredictionRepository(AppDbContext context) : base(context) { }
    }
}



