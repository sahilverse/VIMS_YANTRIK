using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class StockMovement : BaseEntity
    {
        public Guid PartId { get; set; }
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public ReferenceType ReferenceType { get; set; }
        public Guid? ReferenceId { get; set; }
        public Guid CreatedBy { get; set; }

        public Part Part { get; set; } = null!;
    }
}



