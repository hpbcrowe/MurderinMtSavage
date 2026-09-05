using System;
using System.ComponentModel.DataAnnotations;

namespace CroweQuest.Models.Genealogy
{
    public class SourceCreate
    {
        public int SourceId { get; set; }

        [Required(ErrorMessage = "Source title is required")]
        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string Title { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string SourceType { get; set; }

        [MaxLength(1000, ErrorMessage = "Must be 1000 characters or less")]
        public string Citation { get; set; }

        [MaxLength(5000, ErrorMessage = "Must be 5000 characters or less")]
        public string Description { get; set; }

        public DateTime? DocumentDate { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string Location { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string Repository { get; set; }

        [MaxLength(500, ErrorMessage = "Must be 500 characters or less")]
        public string AttachedFileUrl { get; set; }

        public int? FileId { get; set; }
    }
}