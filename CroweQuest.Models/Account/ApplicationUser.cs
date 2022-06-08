/**********************************
 *  MODEL FOR A USER'S ACCOUNT
 *  HOLDS  PROPERTIES FROM THE APPLICATION USER TABLE
 *  IN THE SQL DATABASE
 *  FOR USE ON THE APPLICATION
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  Data isn't loaded from this model directly
 *  Token is generated.
 *  THIS IS NEEDED FOR ORM DAPPER
 * *******************************/

using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Account
{
    public class ApplicationUser
    {
        public int ApplicationUserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string LineOfDescent { get; set; }
        public string Token { get; set; }
    }
 

}
