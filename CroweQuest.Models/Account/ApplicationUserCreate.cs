/******************************************
 *  MODEL APPLICATION USER CREATE
 *  MODEL TO CREATE A USER 
 *  IN THE SQL DATABASE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular 
 * THIS IS NEEDED FOR ORM DAPPER
 * ****************************************/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CroweQuest.Models.Account
{
    public class ApplicationUserCreate : ApplicationUserLogin
    {
        
        [MinLength(10, ErrorMessage = "Must Be At Least 10 Characters")]
        [MaxLength(30, ErrorMessage = "Cannot Be More Than 30 Characters")]
        public string Fullname { get; set; }

        [Required(ErrorMessage = "Email is Required")]
        [MaxLength(30, ErrorMessage = "No More Than Thirty Characters Are Allowed")]
        [EmailAddress( ErrorMessage = "Invalid Email Format")]
        public string Email { get; set; }

        // Holds User's ascendency
        public string LineOfDescent { get; set; }
    }
}
