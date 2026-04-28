using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Appointment : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid VehicleId { get; set; }
        public string? ServiceType { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        public Customer Customer { get; set; } = null!;
        public Vehicle Vehicle { get; set; } = null!;
    }
}



