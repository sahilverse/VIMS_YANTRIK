using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Yantrik.Entities
{
    public class User : IdentityUser<Guid>
    {
        public bool IsActive { get; set; } = true;
        public bool MustChangePassword { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        public Employee? Employee { get; set; }
        public Customer? CustomerProfile { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}



