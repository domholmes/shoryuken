using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using NodaTime;
using NodaTime.Text;
using System.Text.RegularExpressions;

namespace Squirrel.Models
{
    [AttributeUsage(AttributeTargets.Class)]
    public class StartTimeBeforeEndValidation : ValidationAttribute
    {   
        public override Boolean IsValid(Object value)
        {
            var reminder = (Reminder)value;
            
            bool startIsBeforeEnd = Time.ConvertTime(reminder.StartTime) < Time.ConvertTime(reminder.EndTime);

            if (!startIsBeforeEnd)
            {
                ErrorMessage = "Start time must be before end time";
                return false;
            }

            return true;
        }
    }

    [AttributeUsage(AttributeTargets.Class)]
    public class ValidLocation : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var reminder = (Reminder)value;

            if (reminder.Action == DeviceAction.LocationEnter || reminder.Action == DeviceAction.LocationLeave)
            {
                var latLongRegex = new Regex(@"^-?\d+\.\d+,-?\d+\.\d+$");

                if (string.IsNullOrEmpty(reminder.LatLong) || !latLongRegex.IsMatch(reminder.LatLong))
                {
                    ErrorMessage = "A recognised location must be supplied";
                    return false;
                }
            }

            return true;
        }
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class DeviceActionId : ValidationAttribute
    {
        public override Boolean IsValid(Object value)
        {
            var actionId = (int)value;
            
            if (!System.Enum.GetValues(typeof(DeviceAction)).Cast<int>().Contains(actionId))
            {
                ErrorMessage = "{0} is not a valid ActionId";
                return false;
            }

            return true;
        }
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class Time : ValidationAttribute
    {
        public override Boolean IsValid(Object value)
        {
            var time = (string)value;

            bool timeIsConvertable = ConvertTime(time) != null;

            if (!timeIsConvertable)
            {
                ErrorMessage = "{0} is not a valid time";
                return false;
            }

            return true;
        }

        public static LocalTime? ConvertTime(string time)
        {
            LocalTimePattern pattern = LocalTimePattern.CreateWithInvariantCulture("HH:mm");
            ParseResult<LocalTime> result = pattern.Parse(time);

            if (!result.Success)
            {
                return null;
            }

            return result.Value;
        }
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class DaysOfTheWeek : ValidationAttribute 
    {
        public override Boolean IsValid(Object value) 
        {
            var days = (string)value;

            if (days.Count() < 1 || days.Count() > 7)
            {
                ErrorMessage = "At least 1 day must be chosen";
                return false;
            }

            if (days.Any(d => int.Parse(d.ToString()) < 1 || int.Parse(d.ToString()) > 7))
            {
                ErrorMessage = "'{0}' contains invalid days";
                return false;
            }

            return true;
        }
    }
}