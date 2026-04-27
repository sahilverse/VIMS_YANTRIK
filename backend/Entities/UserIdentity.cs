using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Yantrik.Common;

namespace Yantrik.Entities
{
    public class User : IdentityUser<Guid>
    {
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public StaffProfile? StaffProfile { get; set; }
        public Customer? CustomerProfile { get; set; }
    }

    public class Role : IdentityRole<Guid>
    {
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public class RefreshToken : BaseEntity
    {
        public Guid UserId { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }

        public User User { get; set; } = null!;
    }
}

