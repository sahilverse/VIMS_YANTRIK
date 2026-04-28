using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class ServiceRecord : BaseEntity
    {
        public Guid AppointmentId { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Cost { get; set; }
        public Guid EmployeeId { get; set; }

        public Appointment Appointment { get; set; } = null!;
        public Employee Employee { get; set; } = null!;
    }
}



