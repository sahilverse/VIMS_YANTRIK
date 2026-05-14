using System;
using Yantrik.Common;

namespace Yantrik.DTOs
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }
        public Guid VehicleId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string VehicleName { get; set; } = string.Empty;
        public string? ServiceType { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class BookAppointmentRequest
    {
        public Guid VehicleId { get; set; }
        public string? ServiceType { get; set; }
        public DateTime AppointmentDate { get; set; }
    }

    public class UpdateAppointmentStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CompleteAppointmentRequest
    {
        public decimal Cost { get; set; }
        public string? Description { get; set; }
        public Guid EmployeeId { get; set; }
    }

}
