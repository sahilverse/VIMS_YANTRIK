using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.Entities;

namespace Yantrik.DTOs
{
    public class VendorDto
    {
        public Guid Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class CreateVendorRequest
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}



