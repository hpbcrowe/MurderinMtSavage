using CroweQuest.Models.Genealogy;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetAllByApplicationUserIdAsync(int applicationUserId);

        Task<int> MarkAsReadAsync(int notificationId, int applicationUserId);

        Task<int> MarkAllAsReadAsync(int applicationUserId);
    }
}