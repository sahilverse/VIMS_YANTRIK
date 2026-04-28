using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Payment : BaseEntity
    {
        public Guid InvoiceId { get; set; }
        public decimal AmountPaid { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
        public decimal RemainingBalance { get; set; }

        public Invoice Invoice { get; set; } = null!;
    }
}



