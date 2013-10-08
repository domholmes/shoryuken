using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Squirrel.Models;
using Squirrel.Security;

namespace Squirrel.Controllers
{
    [GoogleTokenAuthorizeAttribute]
    public class ReminderMobileController : ApiController
    {
        public IEnumerable<Reminder> PostSyncReminders(int[] reminderIdsToDisable)
        {
            //todo parse json string aaray
            var context = new ReminderContext();

            IEnumerable<Reminder> remindersToDisable = context.Reminders.Where(
                r => 
                    reminderIdsToDisable.Contains(r.Id));

            remindersToDisable.ToList().ForEach(
                r => r.Enabled = false);

            context.SaveChanges();

            var reminders = context.Reminders.Where(
                r => 
                    r.User.Username == User.Identity.Name &&
                    r.Enabled)
                        .ToList();
            
            return reminders;
        }
    }
}
