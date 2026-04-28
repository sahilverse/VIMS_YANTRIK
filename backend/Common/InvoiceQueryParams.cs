using System;
using Yantrik.Entities;

namespace Yantrik.Common
{
    public class InvoiceQueryParams : PaginationParams
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public PaymentStatus? Status { get; set; }
    }
}
