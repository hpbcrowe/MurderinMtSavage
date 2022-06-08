/********************************
 * MODEL BLOG COMMENT
 *  THIS REPRESENTS THE AGGREGATE BLOG COMMENT
 *  IN THE DATABASE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/


using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.BlogComment
{
    public class BlogComment: BlogCommentCreate
    {
        public string Username { get; set; }
        public int ApplicationUserId { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime UpdateDate { get; set; }

    }
}
