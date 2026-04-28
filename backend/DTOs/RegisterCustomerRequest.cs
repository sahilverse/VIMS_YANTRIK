using System.ComponentModel.DataAnnotations;

namespace Yantrik.DTOs
{
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
}



