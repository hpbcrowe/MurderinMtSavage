using System;

namespace CroweQuest.Models.Genealogy
{
    public class AncestorFollower
    {
        public int AncestorFollowerId { get; set; }

        public int AncestorProfileId { get; set; }

        public int ApplicationUserId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}