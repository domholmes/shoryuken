using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Squirrel.Models
{
    public class Reminder
    {
        public int Id { get; set; }

        public string Name { get; set; }
        
        public string Message { get; set; }

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

        public int[] DaysIds
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
    }

    public enum Event
    {
        ChagerConnected,
        ChargerDisconnected
    }
}