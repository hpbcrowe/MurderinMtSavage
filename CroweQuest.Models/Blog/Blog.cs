/********************************
 * MODEL BLOG CREATE
 *  USED TO STORE A BLOG
 *  REPRESENTS THE AGGREGATE BLOG IN THE
 *  DATABASE
 *  INHERITS FROM BLOGCREATE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/


using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Blog
{
    public class Blog : BlogCreate
    {
        public string Username { get; set; }
        public int ApplicationUserId { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime UpdateDate { get; set; }


    }
}
