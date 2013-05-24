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
    [Authorize]
    public class ReminderController : ApiController
    {
        public IEnumerable<Reminder> Get()
        {
            var context = new ReminderContext();

            return context.Reminders.Where(r => r.User.Username == this.User.Identity.Name);
        }

        public HttpResponseMessage Post(Reminder reminder)
        {
            using (var context = new ReminderContext())
            {
                User user = context.Users.Where(u => u.Username == User.Identity.Name).SingleOrDefault();

                if (user == null)
                {
                    return Request.CreateResponse<Reminder>(HttpStatusCode.BadRequest, reminder);    
                }

                reminder.User = user;
            
                context.Reminders.Add(reminder);
                context.SaveChanges();
            }
            
            return Request.CreateResponse<Reminder>(HttpStatusCode.Created, reminder);
        }

        public HttpResponseMessage Put(Reminder reminder)
        {
            using (var context = new ReminderContext())
            {
                if (!context.Reminders.Where(r => r.Id == reminder.Id).Any())
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }

                context.Reminders.Attach(reminder);
                context.Entry(reminder).State = EntityState.Modified;

                context.SaveChanges();
            }

            return Request.CreateResponse<Reminder>(HttpStatusCode.OK, reminder);
        }

        public HttpResponseMessage Delete(int id)
        {
            var reminder = new Reminder()
            {
                Id = id
            };
            
            using (var context = new ReminderContext())
            {
                context.Reminders.Attach(reminder);
                context.Reminders.Remove(reminder);
                context.SaveChanges();
            }

            return Request.CreateResponse<Reminder>(HttpStatusCode.OK, reminder);
        }
    }
}