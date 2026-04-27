using System;
using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class StaffProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }

        public User User { get; set; } = null!;
    }

    public class Customer : BaseEntity
    {
        public Guid? UserId { get; set; } 
        public string CustomerCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Address { get; set; }
        public int LoyaltyPoints { get; set; }
        public decimal TotalSpend { get; set; }

        public User? User { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

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
