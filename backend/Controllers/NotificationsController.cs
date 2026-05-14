using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Yantrik.DTOs;
using Yantrik.Interfaces.Services;

namespace Yantrik.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Guid.Empty;
            return Guid.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var response = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(response);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var response = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(response);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var response = await _notificationService.MarkAsReadAsync(id, userId);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var response = await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(response);
        }
    }
}
