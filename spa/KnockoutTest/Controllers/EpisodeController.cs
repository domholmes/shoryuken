using System.Linq;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Breeze.WebApi;
using KnockoutTest.Models;

namespace KnockoutTest.Controllers {
  
    [BreezeController]
    public class EpisodeController : ApiController {

        readonly EFContextProvider<BreezeSampleContext> _contextProvider =
            new EFContextProvider<BreezeSampleContext>();

        [HttpGet]
        public string Metadata() {
            return _contextProvider.Metadata();
        }
        
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle) {
            return _contextProvider.SaveChanges(saveBundle);
        }
        
        [HttpGet]
        public IQueryable<Episode> Episodes() {
            return _contextProvider.Context.Subscriptions.SelectMany(s => s.Episodes);
        }

    }
}