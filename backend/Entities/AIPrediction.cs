using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
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
}



