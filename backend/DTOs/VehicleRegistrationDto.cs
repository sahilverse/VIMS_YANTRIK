using System.ComponentModel.DataAnnotations;

namespace Yantrik.DTOs
{
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



