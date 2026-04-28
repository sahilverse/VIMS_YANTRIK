using System;
using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Vehicle : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? VIN { get; set; }

        public Customer Customer { get; set; } = null!;
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<AIPrediction> AIPredictions { get; set; } = new List<AIPrediction>();
    }
}



