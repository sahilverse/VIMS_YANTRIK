using System;
using System.Text.Json.Serialization;

namespace Yantrik.DTOs
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime Expiry { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public bool MustChangePassword { get; set; }
        
        public UserDto User { get; set; } = null!;
    }
}
