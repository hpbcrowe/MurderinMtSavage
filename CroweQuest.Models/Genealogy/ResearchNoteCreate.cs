using System;
using System.ComponentModel.DataAnnotations;

namespace CroweQuest.Models.Genealogy
{
    public class ResearchNoteCreate
    {
        public int ResearchNoteId { get; set; }

        public int? AncestorProfileId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [MinLength(10, ErrorMessage = "Must be at least 10 characters")]
        [MaxLength(8000, ErrorMessage = "Must be 8000 characters or less")]
        public string Content { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string Status { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string ConfidenceLevel { get; set; }

        [MaxLength(200, ErrorMessage = "Must be 200 characters or less")]
        public string Tags { get; set; }
    }
}