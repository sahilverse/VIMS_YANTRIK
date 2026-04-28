using System;
using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class CustomerDto
    {
        public Guid Id { get; set; }
        public string CustomerCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Address { get; set; }
        public int LoyaltyPoints { get; set; }
        public decimal TotalSpend { get; set; }
        public string? Email { get; set; }
        public List<VehicleDto> Vehicles { get; set; } = new();
    }
}



