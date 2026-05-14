using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Entities;
using Yantrik.Interfaces;
using Yantrik.Interfaces.Services;

namespace Yantrik.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;

        public NotificationService(
            IUnitOfWork unitOfWork,
            UserManager<User> userManager,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId)
        {
            var notifications = await _unitOfWork.Notifications
                .Find(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Message = n.Message,
                    Type = n.Type.ToString(),
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<List<NotificationDto>>.SuccessResponse(notifications);
        }

        public async Task<ApiResponse<NotificationCountDto>> GetUnreadCountAsync(Guid userId)
        {
            var count = await _unitOfWork.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
            return ApiResponse<NotificationCountDto>.SuccessResponse(new NotificationCountDto { UnreadCount = count });
        }

        public async Task<ApiResponse<bool>> MarkAsReadAsync(Guid notificationId, Guid userId)
        {
            var notification = await _unitOfWork.Notifications.GetByIdAsync(notificationId);
            if (notification == null || notification.UserId != userId)
                return ApiResponse<bool>.FailureResponse("Notification not found");

            notification.IsRead = true;
            _unitOfWork.Notifications.Update(notification);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId)
        {
            var unreadNotifications = await _unitOfWork.Notifications
                .Find(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (!unreadNotifications.Any())
                return ApiResponse<bool>.SuccessResponse(true, "No unread notifications");

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                _unitOfWork.Notifications.Update(notification);
            }

            await _unitOfWork.CompleteAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task CheckLowStockAndNotifyAsync()
        {
            var lowStockParts = await _unitOfWork.Parts.GetLowStockPartsAsync();
            if (!lowStockParts.Any()) return;

            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            if (!admins.Any()) return;

            foreach (var part in lowStockParts)
            {
                var alreadyNotified = await _unitOfWork.Notifications.ExistsAsync(n => 
                    n.Type == NotificationType.StockAlert && 
                    n.Message.Contains(part.SKU) && 
                    n.CreatedAt >= DateTime.UtcNow.AddHours(-24));

                if (alreadyNotified) continue;

                foreach (var admin in admins)
                {
                    var notification = new Notification
                    {
                        UserId = admin.Id,
                        Message = $"Low Stock Alert: {part.Name} ({part.SKU}) is at {part.StockQuantity} units. Threshold is {part.MinThreshold}.",
                        Type = NotificationType.StockAlert,
                        IsRead = false
                    };
                    await _unitOfWork.Notifications.AddAsync(notification);
                }
            }

            await _unitOfWork.CompleteAsync();
        }

        public async Task CheckOverdueCreditsAndNotifyAsync()
        {
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            
            var overdueInvoices = await _unitOfWork.Invoices
                .Find(i => i.PaymentStatus != PaymentStatus.Paid && i.Date <= oneMonthAgo)
                .Include(i => i.Customer)
                    .ThenInclude(c => c!.User)
                .ToListAsync();

            if (!overdueInvoices.Any()) return;

            var admins = await _userManager.GetUsersInRoleAsync("Admin");

            foreach (var invoice in overdueInvoices)
            {
                if (invoice.Customer == null) continue;

                var reminderExists = await _unitOfWork.Notifications.ExistsAsync(n => 
                    n.Type == NotificationType.OverduePayment && 
                    n.Message.Contains(invoice.InvoiceNumber) && 
                    n.CreatedAt >= DateTime.UtcNow.AddDays(-7));

                if (reminderExists) continue;

                var dueDateString = invoice.DueDate?.ToString("MMM dd, yyyy") ?? invoice.Date.AddDays(30).ToString("MMM dd, yyyy");

                if (invoice.Customer.User != null && !string.IsNullOrEmpty(invoice.Customer.User.Email))
                {
                    Hangfire.BackgroundJob.Enqueue<IEmailService>(x => x.SendOverdueReminderEmailAsync(
                        invoice.Customer.User.Email,
                        invoice.Customer.FullName,
                        invoice.InvoiceNumber,
                        invoice.TotalAmount,
                        dueDateString
                    ));
                }
                foreach (var admin in admins)
                {
                    var notification = new Notification
                    {
                        UserId = admin.Id,
                        Message = $"Overdue Payment: Invoice {invoice.InvoiceNumber} for {invoice.Customer.FullName} (Rs. {invoice.TotalAmount}) is older than 1 month.",
                        Type = NotificationType.OverduePayment,
                        IsRead = false
                    };
                    await _unitOfWork.Notifications.AddAsync(notification);
                }
            }

            await _unitOfWork.CompleteAsync();
        }
    }
}
