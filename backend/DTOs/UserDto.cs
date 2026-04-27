using System;
using System.Text.Json.Serialization;
using Yantrik.Entities;

namespace Yantrik.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Code { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class StaffRegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; } = UserRole.Staff; 
    }

    public class UpdateStaffRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserRole Role { get; set; }
    }

    public class CustomerWithVehicleRegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        
        // Vehicle Info
        public string PlateNumber { get; set; } = string.Empty;
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
    }
}
