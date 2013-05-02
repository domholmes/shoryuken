using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Squirrel.Models;

namespace Squirrel.Controllers
{
    public class ReminderMobileController : ApiController
    {
        public IEnumerable<Reminder> Get()
        {
            var context = new ReminderContext();

            return context.Reminders;
        }
    }
}
