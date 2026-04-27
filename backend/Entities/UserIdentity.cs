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

        public StaffProfile? StaffProfile { get; set; }
        public Customer? CustomerProfile { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }

    public class Role : IdentityRole<Guid>
    {
        public string? Description { get; set; }
    }

    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
        
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
