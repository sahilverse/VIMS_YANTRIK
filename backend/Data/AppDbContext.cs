using Microsoft.EntityFrameworkCore;
using System.Linq;
using Yantrik.Entities;

namespace Yantrik.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<StaffProfile> StaffProfiles { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Part> Parts { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PartRequest> PartRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AIPrediction> AIPredictions { get; set; }
        public DbSet<ReportExport> ReportExports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relationships

            // User - Roles (One to Many)
            modelBuilder.Entity<Role>()
                .HasOne(r => r.User)
                .WithMany(u => u.Roles)
                .HasForeignKey(r => r.UserId);

            // Store Enums as Strings
            modelBuilder.Entity<Role>()
                .Property(r => r.Name)
                .HasConversion<string>();

            modelBuilder.Entity<Invoice>()
                .Property(i => i.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Invoice>()
                .Property(i => i.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<PartRequest>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Notification>()
                .Property(n => n.Type)
                .HasConversion<string>();

            modelBuilder.Entity<ReportExport>()
                .Property(r => r.ReportType)
                .HasConversion<string>();

            // User - StaffProfile (One to One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.StaffProfile)
                .WithOne(s => s.User)
                .HasForeignKey<StaffProfile>(s => s.UserId);

            // User - Customer (One to One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.CustomerProfile)
                .WithOne(c => c.User)
                .HasForeignKey<Customer>(c => c.UserId);

            // Invoice Relationships
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Customer)
                .WithMany(c => c.Invoices)
                .HasForeignKey(i => i.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Vendor)
                .WithMany(v => v.Invoices)
                .HasForeignKey(i => i.VendorId)
                .OnDelete(DeleteBehavior.SetNull);

            // InvoiceItem - Part
            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Part)
                .WithMany(p => p.InvoiceItems)
                .HasForeignKey(ii => ii.PartId);

            // Decimal Precision
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetPrecision(18);
                property.SetScale(2);
            }
        }
    }
}
