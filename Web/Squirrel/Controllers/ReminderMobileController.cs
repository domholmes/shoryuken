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
        public IEnumerable<Reminder> GetActiveReminders()
        {
            var context = new ReminderContext();
 
            var reminders = context.Reminders.Where(
                r => 
                    r.User.Username == User.Identity.Name &&
                    r.Enabled)
                        .ToList();
            
            return reminders;
        }

        public HttpResponseMessage PostReminderDisable(int id)
        {
            var context = new ReminderContext();
            
            var reminder = context.Reminders
                .Where(r => r.User.Username == User.Identity.Name && r.Id == id).SingleOrDefault();

            if (reminder == null)
            {
                return Request.CreateResponse<int>(HttpStatusCode.BadRequest, id);
            }

            reminder.Enabled = false;
            context.SaveChanges();

            return Request.CreateResponse<int>(HttpStatusCode.OK, id);
        }
    }
}
