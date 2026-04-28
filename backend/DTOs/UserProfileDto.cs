using System;

namespace Yantrik.DTOs
{
    public class UserProfileDto
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; } 
        public string Code { get; set; } = string.Empty; 
        public string Role { get; set; } = string.Empty;
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; } 
    }
}
