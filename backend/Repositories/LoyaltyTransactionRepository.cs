using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class LoyaltyTransactionRepository : GenericRepository<LoyaltyTransaction>, ILoyaltyTransactionRepository
    {
        public LoyaltyTransactionRepository(AppDbContext context) : base(context) { }
    }
}



