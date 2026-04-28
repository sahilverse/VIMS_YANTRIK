using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class LoyaltyTransaction : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid InvoiceId { get; set; }
        public int PointsEarned { get; set; }
        public decimal DiscountApplied { get; set; }

        public Customer Customer { get; set; } = null!;
        public Invoice Invoice { get; set; } = null!;
    }
}



