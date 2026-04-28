using Microsoft.AspNetCore.Identity;
using System;

namespace Yantrik.Entities
{
    public class Role : IdentityRole<Guid>
    {
        public string? Description { get; set; }
    }
}



