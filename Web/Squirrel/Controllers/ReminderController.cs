using Breeze.WebApi2;
using System.Web.Http;
using Squirrel.Models;
using System.Linq;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider;
using Squirrel.Security;
using Squiirel.Security;

namespace Squirrel.Controllers
{
    [SilentAuthorizeAttribute]
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
        [ValidateAntiForgeryTokenOnPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return context.SaveChanges(saveBundle);
        }
    }
}
