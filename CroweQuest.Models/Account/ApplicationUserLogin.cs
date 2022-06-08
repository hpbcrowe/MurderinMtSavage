/**********************************
 *  MODEL TO LOG IN A USER
 *  HOLDS  PROPERTIES FROM THE APPLICATION USER TABLE
 *  IN THE SQL DATABASE
 *  TO LOG IN A USER
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 * THIS IS NEEDED FOR ORM DAPPER
 * *******************************/


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CroweQuest.Models.Account
{
    public class ApplicationUserLogin
    {
        [Required(ErrorMessage = "Username is Required")]
        [MinLength(5, ErrorMessage = "Must Be At Least 5 Characters")]
        [MaxLength(20, ErrorMessage = "Cannot Be More Than 20 Characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is Required")]
        [MinLength(10, ErrorMessage = "Must Be At Least 10 Characters")]
        [MaxLength(50, ErrorMessage = "Cannot Be More Than 50 Characters")]
        public string Password { get; set; }
    }
}
