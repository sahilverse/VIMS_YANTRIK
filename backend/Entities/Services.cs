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

    public class Review : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }

        public Customer Customer { get; set; } = null!;
    }

    public class PartRequest : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public PartRequestStatus Status { get; set; } = PartRequestStatus.Requested;

        public Customer Customer { get; set; } = null!;
    }

    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; }

        public User User { get; set; } = null!;
    }

    public class AIPrediction : BaseEntity
    {
        public Guid VehicleId { get; set; }
        public Guid PartId { get; set; }
        public decimal ConfidenceScore { get; set; }
        public DateTime PredictedFailureDate { get; set; }
        public string? AnalysisReason { get; set; }

        public Vehicle Vehicle { get; set; } = null!;
        public Part Part { get; set; } = null!;
    }

    public class ReportExport : BaseEntity
    {
        public Guid GeneratedBy { get; set; }
        public ReportType ReportType { get; set; }
        public string? FilePath { get; set; }
        public string? ParametersJson { get; set; }

        public User User { get; set; } = null!;
    }
}
