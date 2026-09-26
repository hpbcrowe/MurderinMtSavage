/********************************
 * MODEL BLOG CREATE
 *  USED TO CREATE A BLOG
 *  WILL MATCH TABLE IN DATABASE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CroweQuest.Models.Blog
{
    public class BlogCreate
    {
        public int BlogId { get; set; }

        public int? AncestorProfileId { get; set; }

        public int? SourceId { get; set; }

        [Required(ErrorMessage = "A Title is required")]
        [MinLength(10, ErrorMessage = "Must be 10-50 characters")]
        [MaxLength(50, ErrorMessage = "Must be 10-50 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [MinLength(50, ErrorMessage = "At Least fifty Characters are Required")]
        [MaxLength(5000, ErrorMessage = "Must be 50-5000 characters")]
        public string Content { get; set; }

        public int? PhotoId { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string AncestorName { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string RecordType { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string Location { get; set; }

        [MaxLength(100, ErrorMessage = "Must be 100 characters or less")]
        public string FamilyBranch { get; set; }

        [MaxLength(200, ErrorMessage = "Must be 200 characters or less")]
        public string Tags { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string ConfidenceLevel { get; set; }

        [MaxLength(50, ErrorMessage = "Must be 50 characters or less")]
        public string ResearchStatus { get; set; }
    }
}

