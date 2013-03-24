using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartReminder.Models
{
    public class Moment
    {   
        public int Id
        { 
            get; 
            set; 
        }

        public string Name
        {
            get;
            set;
        }

        public int EventId
        {
            get;
            set;
        }

        public Event Event
        {
            get
            {
                return (Event)this.EventId;
            }
            set
            {
                this.EventId = (int)value;
            }
        }

        public Wifi Wifi
        { 
            get; 
            set; 
        }

        public DateTime StartTime
        { 
            get; 
            set; 
        }

        public DateTime EndTime
        { 
            get; 
            set; 
        }

        public DayOfWeek[] Days
        {
            get;
            set;
        }
    }

    public enum Event
    {
        WifiConnected,
        WifiDisconnected,
        ChagerConnected,
        ChargerDisconnected
    }
}