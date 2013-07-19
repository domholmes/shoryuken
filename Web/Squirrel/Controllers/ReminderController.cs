using System.Web.Http;
using Breeze.WebApi;
using Squirrel.Models;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Squirrel.Controllers
{
    [BreezeController]
    public class ReminderController : ApiController
    {

        readonly EFContextProvider<ReminderContext> _contextProvider =
            new EFContextProvider<ReminderContext>();

        // ~/breeze/todos/Metadata
        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        // ~/breeze/todos/Todos
        // ~/breeze/todos/Todos?$filter=IsArchived eq false&$orderby=CreatedAt
        [HttpGet]
        public IQueryable<Reminder> Reminders()
        {
            return _contextProvider.Context.Reminders;
        }

        // ~/breeze/todos/SaveChanges
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        // other miscellaneous actions of no interest to us here
    }
}
