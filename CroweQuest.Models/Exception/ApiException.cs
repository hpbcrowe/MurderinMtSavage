/*****************************
 * MODEL EXCEPTION EXCEPTION
 * WHENEVER AN EXCEPTION IS THROWN IT
 * WILL BE WRAPPED IN THIS CLASS/OBJECT
 * THIS IS NEEDED FOR ORM DAPPER
 * **************************/

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Exception
{
    public class ApiException
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
