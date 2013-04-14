using System;
using System.Data.Entity;
using System.Collections.Generic;
using SmartReminder.Models;
using SmartReminder.Account;

namespace SmartReminder.Models
{
    public class RemindertDatabaseInitializer :
        // If you prefer to preserve the database between server sessions
        // inherit from DropCreateDatabaseIfModelChanges
        //DropCreateDatabaseIfModelChanges<BreezeSampleContext>

        // When creating the database the first time or 
        // if you prefer to recreate with every new server session
        // inherit from DropCreateDatabaseAlways 
        DropCreateDatabaseIfModelChanges<ReminderContext>
    {
        protected override void Seed(ReminderContext context)
        {   
            var leavingForWork = new Moment
            {
                Name = "Leaving for work",
                Event = Event.ChargerDisconnected,
                StartTime = DateTime.Parse("07:00"),
                EndTime = DateTime.Parse("08:30"),
                Days = new[]
                {
                    DayOfWeek.Monday,
                    DayOfWeek.Tuesday,
                    DayOfWeek.Wednesday,
                    DayOfWeek.Thursday,
                    DayOfWeek.Friday
                }
            };

            var gettingHomeFromWork = new Moment
            {
                Name = "Getting home after work",
                Event = Event.WifiConnected,
                Wifi = new Wifi
                {
                    Ssid = "BTHomeHub4078"
                },
                StartTime = DateTime.Parse("17:00"),
                EndTime = DateTime.Parse("18:30"),
                Days = new[]
                {
                    DayOfWeek.Monday,
                    DayOfWeek.Tuesday,
                    DayOfWeek.Wednesday,
                    DayOfWeek.Thursday,
                    DayOfWeek.Friday
                }
            };
            
            var reminders = new List<Reminder>
                {
                    new Reminder
                    {
                        FirstOcurrence = true,
                        SpecificDate = null,
                        Moment = leavingForWork,
                        NotificationText = "Bring DVD for Duncan"
                    },
                    new Reminder
                    {
                        FirstOcurrence = true,
                        SpecificDate = new DateTime(2013,3,25),
                        Moment = gettingHomeFromWork,
                        NotificationText = "Ring BT"
                    }
                };

            var dom = new User
            {
                Email = "thecapsaicinkid@gmail.com",
                PasswordHash = UserMembershipProvider.HashBytes("hadoken"),
                Reminders = reminders
            };

            context.Users.Add(dom);

            context.SaveChanges(); // Save 'em
        }
    }
}
