/********************************
 * MODEL PHOTO PHOTO 
 * 
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/
using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Photo
{
    public class Photo: PhotoCreate
    {
        public int PhotoId { get; set; }
        public int ApplicationUserId { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
