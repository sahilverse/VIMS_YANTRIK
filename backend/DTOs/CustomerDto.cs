using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

    public class VehicleDto
    {
        public Guid Id { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? VIN { get; set; }
    }

    public class RegisterCustomerRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        public string? Address { get; set; }

        public string? Email { get; set; } // If provided, we might link to a User account later

        [Required]
        public VehicleRegistrationDto Vehicle { get; set; } = null!;
    }

    public class VehicleRegistrationDto
    {
        [Required]
        public string PlateNumber { get; set; } = string.Empty;

        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? VIN { get; set; }
    }
}
