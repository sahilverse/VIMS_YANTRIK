using System;

namespace Yantrik.DTOs
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., "StockAlert", "OverduePayment"
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class NotificationCountDto
    {
        public int UnreadCount { get; set; }
    }
}
