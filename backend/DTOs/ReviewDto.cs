using System;

namespace Yantrik.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public Guid? AppointmentId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CustomerName { get; set; }
        public string? ServiceType { get; set; }
        public string? VehicleName { get; set; }
    }

    public class CreateReviewDto
    {
        public Guid? AppointmentId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
