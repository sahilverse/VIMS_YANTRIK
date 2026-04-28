using Yantrik.Data;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Repositories
{
    public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(AppDbContext context) : base(context) { }
    }
}



