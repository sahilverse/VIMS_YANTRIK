using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class EmailLogRepository : GenericRepository<EmailLog>, IEmailLogRepository
    {
        public EmailLogRepository(AppDbContext context) : base(context) { }
    }
}



