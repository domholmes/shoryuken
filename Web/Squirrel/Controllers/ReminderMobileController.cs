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
        public IEnumerable<Reminder> Get()
        {
            using (var context = new ReminderContext())
            {
                return context.Reminders.Where(r => r.User.Username == User.Identity.Name);
            }
        }
    }
}
