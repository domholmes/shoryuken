using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Squirrel.Models;

namespace Squirrel.Controllers
{
    public class RemindersController : ApiController
    {
        // POST api/reminders
        public HttpResponseMessage Post(Reminder reminder)
        {
            var context = new ReminderContext();
            
            context.Reminders.Add(reminder);
            context.SaveChanges();

            var response = Request.CreateResponse<Reminder>(HttpStatusCode.Created, reminder);

            return response;
        }
    }
}