using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDto>> GetCustomerAppointmentsAsync(Guid userId);
        Task<AppointmentDto> BookAppointmentAsync(Guid userId, BookAppointmentRequest request);
        Task<AppointmentDto> UpdateAppointmentAsync(Guid userId, Guid appointmentId, BookAppointmentRequest request);
        Task<bool> CancelAppointmentAsync(Guid userId, Guid appointmentId);
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync(string? statusFilter = null);
        Task<AppointmentDto> UpdateAppointmentStatusAsync(Guid appointmentId, string status);
        Task<bool> DeleteAppointmentAsync(Guid appointmentId);
    }
}
