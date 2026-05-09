using System;

namespace Yantrik.DTOs
{
    public class PartRequestDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public Guid PartId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public string PartSKU { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePartRequestDto
    {
        public Guid PartId { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdatePartRequestStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
