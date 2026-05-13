using System;
using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class CustomerDashboardDto
    {
        public decimal TotalSpent { get; set; }
        public int VehicleCount { get; set; }
        public int AppointmentCount { get; set; }
        public List<DashboardVehicleDto> RecentVehicles { get; set; } = new();
        public List<DashboardAppointmentDto> UpcomingAppointments { get; set; } = new();
        public List<DashboardInvoiceDto> RecentInvoices { get; set; } = new();
    }

    public class DashboardVehicleDto
    {
        public Guid Id { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
    }

    public class DashboardAppointmentDto
    {
        public Guid Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? ServiceType { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PlateNumber { get; set; } = string.Empty;
    }

    public class DashboardInvoiceDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime Date { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
