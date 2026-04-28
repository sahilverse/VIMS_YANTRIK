using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class InvoiceItem : BaseEntity
    {
        public Guid InvoiceId { get; set; }
        public Guid PartId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } 

        public Invoice Invoice { get; set; } = null!;
        public Part Part { get; set; } = null!;
    }
}



