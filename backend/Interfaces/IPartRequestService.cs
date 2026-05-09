using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.DTOs;

namespace Yantrik.Interfaces
{
    public interface IPartRequestService
    {
        Task<IEnumerable<PartRequestDto>> GetCustomerRequestsAsync(Guid userId);
        Task<IEnumerable<PartRequestDto>> GetAllRequestsAsync(string? statusFilter = null);
        Task<PartRequestDto> SubmitRequestAsync(Guid userId, CreatePartRequestDto request);
        Task<PartRequestDto> UpdateRequestStatusAsync(Guid requestId, UpdatePartRequestStatusDto request);
    }
}
