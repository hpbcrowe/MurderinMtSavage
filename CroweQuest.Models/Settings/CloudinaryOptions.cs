/************************
 * MODELS SETTINGS CLOUDINARYOPTIONS
 *  HOLDS THE SETTINGS FOR CLOUDINARY
 *  THIS IS NEEDED FOR ORM DAPPER
 * ***************************/
using System;
using System.Collections.Generic;
using System.Text;

namespace CroweQuest.Models.Settings
{
    public class CloudinaryOptions
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }
}
