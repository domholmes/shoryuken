using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Squirrel.Models
{
    public class Reminder
    {
        public int Id { get; set; }

        public User User { get; set; }

        public bool Enabled { get; set; }

        public string Name { get; set; }
        
        [Required]
        public string Message { get; set; }

        public TimeSpan StartTime
        {
            get;
            set;
        }

        public TimeSpan EndTime
        {
            get;
            set;
        }

        public string Days
        {
            get;
            set;
        }

        public int ActionId
        {
            get;
            set;
        }

        public Action Action
        {
            get
            {
                return (Action)this.ActionId;
            }
            set
            {
                this.ActionId = (int)value;
            }
        }
    }

    public enum Action
    {
        WifiConnected = 0,
        WifiDisconnected = 1,
        ChagerConnected = 2,
        ChargerDisconnected = 3
    }
}