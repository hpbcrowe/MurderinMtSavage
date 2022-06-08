/********************************
 * MODEL BLOG PAGED RESULTS
 *  USED TO DO PAGINATION
 *  ITEMS VARIABLE CAN HOLD ANY OBJECT
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/


using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Blog
{
    public class PagedResults<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
