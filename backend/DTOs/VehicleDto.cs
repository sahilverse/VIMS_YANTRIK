using System;

namespace Yantrik.DTOs
{
    public class VehicleDto
    {
        public Guid Id { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? VIN { get; set; }
    }
}



