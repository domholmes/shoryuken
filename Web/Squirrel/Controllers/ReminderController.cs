using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Squirrel.Models;
using System.Data;

namespace Squirrel.Controllers
{
    public class ReminderController : ApiController
    {
        public IEnumerable<Reminder> Get()
        {
            var context = new ReminderContext();

            return context.Reminders;
        }

        public HttpResponseMessage Post(Reminder reminder)
        {
            var context = new ReminderContext();
            
            context.Reminders.Add(reminder);
            context.SaveChanges();

            var response = Request.CreateResponse<Reminder>(HttpStatusCode.Created, reminder);

            return response;
        }

        public HttpResponseMessage Put(Reminder reminder)
        {
            var context = new ReminderContext();

            if (!context.Reminders.Where(r => r.Id == reminder.Id).Any())
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            context.Reminders.Attach(reminder);
            context.Entry(reminder).State = EntityState.Modified;

            context.SaveChanges();
            
            var response = Request.CreateResponse<Reminder>(HttpStatusCode.OK, reminder);

            return response;
        }
    }
}