using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class EmailLog : BaseEntity
    {
        public string ToEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public Guid? SentBy { get; set; }
        public string Status { get; set; } = "Sent";
    }
}



