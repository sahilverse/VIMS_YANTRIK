using System;
using System.Collections.Generic;

namespace Yantrik.DTOs
{
    public class CustomerReportDto
    {
        public List<RegularCustomerDto> Regulars { get; set; } = new();
        public List<HighSpenderDto> HighSpenders { get; set; } = new();
        public List<PendingCreditDto> PendingCredits { get; set; } = new();
    }

    public class RegularCustomerDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string CustomerCode { get; set; } = string.Empty;
        public int VisitCount { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class HighSpenderDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string CustomerCode { get; set; } = string.Empty;
        public decimal TotalSpent { get; set; }
        public int VisitCount { get; set; }
    }

    public class PendingCreditDto
    {
        public Guid InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
