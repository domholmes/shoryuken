using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartReminder.Models
{
    public class Reminder
    {
        public int ID
        {
            get;
            set;
        }
        
        public Moment Moment
        {
            get;
            set;
        }

        public bool FirstOcurrence
        { 
            get; 
            set; 
        }

        public DateTime? SpecificDate
        {
            get;
            set;
        }

        public string NotificationText
        { 
            get; 
            set; 
        }        
    }
}