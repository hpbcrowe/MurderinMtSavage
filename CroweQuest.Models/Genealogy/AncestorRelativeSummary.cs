namespace CroweQuest.Models.Genealogy
{
    public class AncestorRelativeSummary
    {
        public int AncestorProfileId { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Gender { get; set; }

        public string RelationshipLabel { get; set; }

        public string DisplayName
        {
            get
            {
                var middleNamePart = string.IsNullOrWhiteSpace(MiddleName) ? string.Empty : $" {MiddleName}";
                return $"{FirstName}{middleNamePart} {LastName}".Trim();
            }
        }
    }
}
