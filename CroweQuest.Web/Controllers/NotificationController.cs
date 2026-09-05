using CroweQuest.Models.Genealogy;
using CroweQuest.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Notification>>> GetAll()
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _notificationRepository.GetAllByApplicationUserIdAsync(applicationUserId));
        }

        [Authorize]
        [HttpPatch("{notificationId}/read")]
        public async Task<ActionResult<int>> MarkRead(int notificationId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _notificationRepository.MarkAsReadAsync(notificationId, applicationUserId));
        }

        [Authorize]
        [HttpPatch("read-all")]
        public async Task<ActionResult<int>> MarkAllRead()
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _notificationRepository.MarkAllAsReadAsync(applicationUserId));
        }
    }
}