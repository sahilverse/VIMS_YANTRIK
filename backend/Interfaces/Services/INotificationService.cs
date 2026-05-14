using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;

namespace Yantrik.Interfaces.Services
{
    public interface INotificationService
    {
        Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId);
        Task<ApiResponse<NotificationCountDto>> GetUnreadCountAsync(Guid userId);
        Task<ApiResponse<bool>> MarkAsReadAsync(Guid notificationId, Guid userId);
        Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId);
        
        Task CheckLowStockAndNotifyAsync();
        Task CheckOverdueCreditsAndNotifyAsync();
    }
}
