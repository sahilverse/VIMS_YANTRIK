using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Yantrik.Data;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;

namespace Yantrik.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AppointmentDto>> GetCustomerAppointmentsAsync(Guid userId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null) return Enumerable.Empty<AppointmentDto>();

            return await _context.Appointments
                .Include(a => a.Vehicle)
                .Where(a => a.CustomerId == customer.Id)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    VehicleId = a.VehicleId,
                    PlateNumber = a.Vehicle.PlateNumber,
                    VehicleName = $"{a.Vehicle.Brand} {a.Vehicle.Model}",
                    ServiceType = a.ServiceType,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<AppointmentDto> BookAppointmentAsync(Guid userId, BookAppointmentRequest request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
                throw new Exception("Customer profile not found");

            // Verify vehicle ownership
            var vehicle = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.Id == request.VehicleId && v.CustomerId == customer.Id);

            if (vehicle == null)
                throw new Exception("Vehicle not found or not owned by you");

            var appointment = new Appointment
            {
                CustomerId = customer.Id,
                VehicleId = request.VehicleId,
                ServiceType = request.ServiceType,
                AppointmentDate = request.AppointmentDate,
                Status = AppointmentStatus.Pending
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appointment.Id,
                VehicleId = appointment.VehicleId,
                PlateNumber = vehicle.PlateNumber,
                VehicleName = $"{vehicle.Brand} {vehicle.Model}",
                ServiceType = appointment.ServiceType,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status.ToString()
            };
        }

        public async Task<AppointmentDto> UpdateAppointmentAsync(Guid userId, Guid appointmentId, BookAppointmentRequest request)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
                throw new Exception("Customer profile not found");

            var appointment = await _context.Appointments
                .Include(a => a.Vehicle)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.CustomerId == customer.Id);

            if (appointment == null)
                throw new Exception("Appointment not found");

            // Validation: Only allow updates for Pending or Confirmed
            if (appointment.Status != AppointmentStatus.Pending && appointment.Status != AppointmentStatus.Confirmed)
                throw new Exception("Only pending or confirmed appointments can be updated");

            // Validation: 24-hour rule
            if (appointment.AppointmentDate < DateTime.UtcNow.AddHours(24))
                throw new Exception("Appointments cannot be changed within 24 hours of the scheduled time");

            // Update fields
            appointment.ServiceType = request.ServiceType;
            appointment.AppointmentDate = request.AppointmentDate;
            appointment.VehicleId = request.VehicleId;

            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appointment.Id,
                VehicleId = appointment.VehicleId,
                PlateNumber = appointment.Vehicle.PlateNumber,
                VehicleName = $"{appointment.Vehicle.Brand} {appointment.Vehicle.Model}",
                ServiceType = appointment.ServiceType,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status.ToString()
            };
        }

        public async Task<bool> CancelAppointmentAsync(Guid userId, Guid appointmentId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null) return false;

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.CustomerId == customer.Id);

            if (appointment == null) return false;

            // Only allow canceling pending or confirmed appointments
            if (appointment.Status == AppointmentStatus.Pending || appointment.Status == AppointmentStatus.Confirmed)
            {
                appointment.Status = AppointmentStatus.Cancelled;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? statusFilter = null)
        {
            var query = _context.Appointments
                .Include(a => a.Vehicle)
                .ThenInclude(v => v.Customer)
                .AsQueryable();

            if (!string.IsNullOrEmpty(statusFilter) && Enum.TryParse<AppointmentStatus>(statusFilter, true, out var status))
            {
                query = query.Where(a => a.Status == status);
            }

            return await query
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    VehicleId = a.VehicleId,
                    PlateNumber = a.Vehicle.PlateNumber,
                    VehicleName = $"{a.Vehicle.Brand} {a.Vehicle.Model}",
                    ServiceType = a.ServiceType,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<AppointmentDto> UpdateAppointmentStatusAsync(Guid appointmentId, string statusStr)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Vehicle)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                throw new Exception("Appointment not found");

            if (!Enum.TryParse<AppointmentStatus>(statusStr, true, out var status))
                throw new Exception("Invalid status");

            appointment.Status = status;
            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                Id = appointment.Id,
                VehicleId = appointment.VehicleId,
                PlateNumber = appointment.Vehicle.PlateNumber,
                VehicleName = $"{appointment.Vehicle.Brand} {appointment.Vehicle.Model}",
                ServiceType = appointment.ServiceType,
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status.ToString()
            };
        }

        public async Task<bool> DeleteAppointmentAsync(Guid appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
