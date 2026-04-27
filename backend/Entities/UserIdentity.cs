using System.Collections.Generic;
using Yantrik.Common;

namespace Yantrik.Entities
{

    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Role> Roles { get; set; } = new List<Role>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public StaffProfile? StaffProfile { get; set; }
        public Customer? CustomerProfile { get; set; }
    }

    public class Role : BaseEntity
    {
        public Guid UserId { get; set; }
        public UserRole Name { get; set; }
        public string? Description { get; set; }

        public User User { get; set; } = null!;
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
