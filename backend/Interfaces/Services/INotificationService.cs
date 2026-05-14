using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface INotificationService
    {
        Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId, string? type = null);
        Task<ApiResponse<NotificationCountDto>> GetUnreadCountAsync(Guid userId, string? type = null);
        Task<ApiResponse<bool>> MarkAsReadAsync(Guid notificationId, Guid userId);
        Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId, string? type = null);
        
        Task CheckLowStockAndNotifyAsync();
        Task CheckOverdueCreditsAndNotifyAsync();
    }
}
