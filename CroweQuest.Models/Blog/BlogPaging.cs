/********************************
 * MODEL BLOG BLOG PAGING
 *  USED TO DO PAGINATION
 *  HAS SET PAGE, AND PAGE SIZE SIX RESULTS 
 *  PER PAGE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/


using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Blog
{
    public class BlogPaging
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 6;
    }
}
