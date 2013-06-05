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
    
    public class ReminderMobileController : ApiController
    {
        [GoogleTokenAuthorizeAttribute]
        public IEnumerable<Reminder> Get()
        {
            var context = new ReminderContext(); 
            var g = context.Reminders.Where(r => r.User.Username == User.Identity.Name).ToList();
            return g;
        }
    }
}
