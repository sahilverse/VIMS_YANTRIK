using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Review : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid? AppointmentId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }

        public Customer Customer { get; set; } = null!;
        public Appointment? Appointment { get; set; }
    }
}



