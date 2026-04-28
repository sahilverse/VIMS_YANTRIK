using System;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class Employee : BaseEntity
    {
        public Guid UserId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }

        public User User { get; set; } = null!;
    }
}



