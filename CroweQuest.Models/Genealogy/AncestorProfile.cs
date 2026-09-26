using System;
using System.Collections.Generic;

namespace CroweQuest.Models.Genealogy
{
    public class AncestorProfile : AncestorProfileCreate
    {
        public string Username { get; set; }

        public int ApplicationUserId { get; set; }

        public DateTime PublishDate { get; set; }

        public DateTime UpdateDate { get; set; }

        public AncestorRelativeSummary Father { get; set; }

        public AncestorRelativeSummary Mother { get; set; }

        public List<AncestorRelativeSummary> Siblings { get; set; } = new List<AncestorRelativeSummary>();

        public List<AncestorRelativeSummary> Children { get; set; } = new List<AncestorRelativeSummary>();
    }
}