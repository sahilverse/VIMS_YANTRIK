using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(AppDbContext context) : base(context) { }
    }
}



