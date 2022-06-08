/********************************
 * MODEL PHOTO PHOTO CREATE
 *  THIS REPRESENTS THE TYPE IN THE DATABASE THAT
 *  THE STORED PROCEDURE TAKES
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * *****************************/

using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Photo
{
    public class PhotoCreate
    {
        public string ImageURL { get; set; }
        public string PublicId { get; set; }
        public string Description { get; set; }

    }
}
