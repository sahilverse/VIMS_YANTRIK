using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; }

        public User User { get; set; } = null!;
    }
}



