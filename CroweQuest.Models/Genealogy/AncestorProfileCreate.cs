using System;
using System.ComponentModel.DataAnnotations;

namespace CroweQuest.Models.Genealogy
{
    public class AncestorProfileCreate
    {
        public int AncestorProfileId { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string FirstName { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string MiddleName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string LastName { get; set; }

        [MaxLength(20, ErrorMessage = "Must be 20 characters or less")]
        public string Suffix { get; set; }

        [MaxLength(20, ErrorMessage = "Must be 20 characters or less")]
        public string Gender { get; set; }

        public DateTime? BirthDate { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string BirthLocation { get; set; }

        public DateTime? DeathDate { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string DeathLocation { get; set; }

        [MaxLength(5000, ErrorMessage = "Must be 5000 characters or less")]
        public string Biography { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string ResearchStatus { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string FamilyBranch { get; set; }

        [MaxLength(200, ErrorMessage = "Must be 200 characters or less")]
        public string Tags { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string ConfidenceLevel { get; set; }

        public int? ProfilePhotoId { get; set; }
    }
}