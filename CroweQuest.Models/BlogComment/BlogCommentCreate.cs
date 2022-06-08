/********************************
 * MODEL BLOG COMMENT CREATE
 *  
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CroweQuest.Models.BlogComment
{
    public class BlogCommentCreate
    {
        public int BlogCommentId { get; set; }
        public int? ParentBlogCommentId { get; set; }
        public int BlogId { get; set; }

        [Required(ErrorMessage = "Content is Required")]
        [MinLength(10, ErrorMessage = "At Least Ten Characters are Required")]
        [MaxLength(300, ErrorMessage = "No More Than Three Hundred Characters are Allowed")]
        public string Content { get; set; }

    }
}
