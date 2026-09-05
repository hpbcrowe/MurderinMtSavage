using System;

namespace CroweQuest.Models.Genealogy
{
    public class AncestorRelationship
    {
        public int AncestorRelationshipId { get; set; }

        public int AncestorProfileId { get; set; }

        public int RelatedAncestorProfileId { get; set; }

        public string RelationshipType { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}