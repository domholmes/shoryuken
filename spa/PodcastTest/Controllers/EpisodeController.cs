using System.Linq;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Breeze.WebApi;

namespace PodcastTest.Controllers
{
    [BreezeController]
    public class EpisodeController : ApiController 
    {
        readonly EFContextProvider<PodcastContext> _contextProvider =
            new EFContextProvider<PodcastContext>();

        [HttpGet]
        public string Metadata() 
        {
            return _contextProvider.Metadata();
        }
        
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle) 
        {
            return _contextProvider.SaveChanges(saveBundle);
        }
        
        [HttpGet]
        public IQueryable<Episode> Episodes() 
        {
            return _contextProvider.Context.Subscriptions.SelectMany(s => s.Episodes);
        }
    }
}