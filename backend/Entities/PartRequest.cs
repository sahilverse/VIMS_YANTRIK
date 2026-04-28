using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class PartRequest : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string PartName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public PartRequestStatus Status { get; set; } = PartRequestStatus.Requested;

        public Customer Customer { get; set; } = null!;
    }
}



