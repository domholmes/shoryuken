using System.Linq;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Breeze.WebApi;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using Microsoft.AspNet.SignalR;

namespace PodcastTest.Controllers
{
    [BreezeController]
    public class EpisodeController : ApiController 
    {
        readonly EFContextProvider<PodcastContext> _contextProvider =
            new EFContextProvider<PodcastContext>();

        Lazy<IHubConnectionContext> _clientsInstance = new Lazy<IHubConnectionContext>(() => GlobalHost.ConnectionManager.GetHubContext<NotificationHub>().Clients);

        [HttpGet]
        public string Metadata() 
        {
            return _contextProvider.Metadata();
        }
        
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle) 
        {
            //this._clientsInstance.Value.All.broadcastEpisodesChangedNotification();
            var r = _contextProvider.SaveChanges(saveBundle);
            return r;
        }
        
        [HttpGet]
        public IQueryable<Episode> Episodes() 
        {
            return _contextProvider.Context.Subscriptions.SelectMany(s => s.Episodes);
        }
    }
}