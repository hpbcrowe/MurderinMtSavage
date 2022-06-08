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

        [Required(ErrorMessage = "A Title is Required")]
        [MinLength(10, ErrorMessage = "At Least Ten Characters are Required")]
        [MaxLength(50, ErrorMessage = "No More Than Fifty Characters are Allowed")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is Required")]
        [MinLength(300, ErrorMessage = "At Least Three Hundred Characters are Required")]
        [MaxLength(3000, ErrorMessage = "No More Than Three Thousand Characters are Allowed")]
       
        public string Content { get; set; }

        public int? PhotoId { get; set; }

    }
}
