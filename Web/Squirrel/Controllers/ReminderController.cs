using System.Web.Http;
using Breeze.WebApi;
using Squirrel.Models;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Squirrel.Controllers
{
    [Authorize]
    [BreezeController]
    public class ReminderController : ApiController
    {

        readonly ReminderContextProvider context;

        public ReminderController()
        {
            context = new ReminderContextProvider(this);
        }

        [HttpGet]
        public string Metadata()
        {
            return context.Metadata();
        }

        [HttpGet]
        public IQueryable<Reminder> Reminders()
        {
            return context.Context.Reminders.Where(r => r.User.Username == this.User.Identity.Name);
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return context.SaveChanges(saveBundle);
        }
    }
}
