using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace Squirrel.Models
{
    [StartTimeBeforeEndValidation]
    public class Reminder
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public User User { get; set; }

        [Required]
        public bool Enabled { get; set; }

        [StringLength(50)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Message { get; set; }

        [Time]
        public string StartTime { get; set; }

        [Time]
        public string EndTime { get; set; }

        [DaysOfTheWeek]
        public string Days { get; set; }

        [DeviceActionId]
        public int ActionId { get; set; }

        [StringLength(20)]
        public string ActionExtra { get; set; }

        [StringLength(50)]
        public string LatLong { get; set; }

        [StringLength(200)]
        public string PlaceName { get; set; }
    }

    public enum DeviceAction
    {
        WifiConnected = 0,
        WifiDisconnected = 1,
        ChagerConnected = 2,
        ChargerDisconnected = 3,
        Location = 4
    }
}