using System;

namespace CroweQuest.Models.Genealogy
{
    public class Notification
    {
        public int NotificationId { get; set; }

        public int ApplicationUserId { get; set; }

        public string NotificationType { get; set; }

        public string Message { get; set; }

        public int? ReferenceId { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}