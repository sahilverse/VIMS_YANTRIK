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
        Task<IEnumerable<PartRequestDto>> GetCustomerPartRequestsAsync(Guid userId);
        Task<PartRequestDto> CreatePartRequestAsync(Guid userId, CreatePartRequestDto request);
    }
}
