using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace Squirrel.Models
{
    public class DemoDbInitializer : DropCreateDatabaseIfModelChanges<ReminderContext>
    {
        protected override void Seed(ReminderContext context)
        {
            var reminders = new List<Reminder>
            {
                new Reminder
                {
                    Id = 1,
                    Name = "Leaving for work",
                    Action = Action.ChargerDisconnected,
                    Message = "Remember DVD for Duncan",
                    Days = "12345",
                    StartTime = DateTime.Parse("07:30"),
                    EndTime = DateTime.Parse("08:30")
                },
                new Reminder
                {
                    Id = 2,
                    Name = "Getting home from work",
                    Action = Action.ChagerConnected,
                    Message = "Ring mum",
                    Days = "12345",
                    StartTime = DateTime.Parse("16:30"),
                    EndTime = DateTime.Parse("19:00")
                }
            };
            
            reminders.ForEach(r => context.Reminders.Add(r));
        }
    }
}