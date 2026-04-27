using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Yantrik.Entities;

namespace Yantrik.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();
            
            // Seed Roles
            string[] roleNames = { "Admin", "Staff", "Customer" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new Role { Name = roleName, NormalizedName = roleName.ToUpper() });
                }
            }

            // Seed Admin User
            var adminEmail = config["AdminUser:Email"];
            if (!string.IsNullOrEmpty(adminEmail))
            {
                var adminUser = await userManager.FindByEmailAsync(adminEmail);
                if (adminUser == null)
                {
                    var user = new User
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true,
                        IsActive = true,
                        StaffProfile = new StaffProfile
                        {
                            FullName = config["AdminUser:FullName"]!,
                            EmployeeCode = "EMP-1001",
                            Phone = "9876543210"
                        }
                    };

                    var result = await userManager.CreateAsync(user, config["AdminUser:Password"]!);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                }
            }
        }
    }
}
