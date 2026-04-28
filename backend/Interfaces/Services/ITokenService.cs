using System.Collections.Generic;
using System.Security.Claims;
using Yantrik.Entities;

namespace Yantrik.Interfaces.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user, IEnumerable<string> roles);
        string GenerateRefreshToken();
        string HashToken(string token);
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}




