/***************************************
 *  MODEL TO USE ASP.NET CORE'S IDENTITY
 *  TO LOG IN A USER AND AUTHENTICATE
 *  CARRIES FIELDS, LOADS FROM DATABASE
 *  This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 *  THIS IS NEEDED FOR ORM DAPPER
 * ***********************************/

using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Account
{
    public class ApplicationUserIdentity
    {
        public int ApplicationUserId { get; set; }

        public string Username { get; set; }

        //Changes username to all upper case
        public string NormalizedUsername { get; set; }

        public string Email { get; set; }

        //Changes Email to all upper case
        public string NormalizedEmail { get; set; }

        public string Fullname { get; set; }

        //This is the field that holds the user's ascendency
        public string LineOfDescent { get; set; }

        public string PasswordHash { get; set; }
    }
}
