using System;

namespace CroweQuest.Models.Genealogy
{
    public class Source : SourceCreate
    {
        public string Username { get; set; }

        public int ApplicationUserId { get; set; }

        public DateTime PublishDate { get; set; }

        public DateTime UpdateDate { get; set; }
    }
}