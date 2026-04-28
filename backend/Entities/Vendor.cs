using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Vendor : BaseEntity
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}



