using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class PartRequest : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid PartId { get; set; }
        public string? Notes { get; set; }
        public PartRequestStatus Status { get; set; } = PartRequestStatus.Pending;

        public Customer Customer { get; set; } = null!;
        public Part Part { get; set; } = null!;
    }
}



