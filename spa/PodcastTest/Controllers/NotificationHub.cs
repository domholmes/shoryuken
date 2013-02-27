using System;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace PodcastTest.Controllers
{
    public class NotificationHub : Hub
    {
        public void BroadcastEpisodesChangedNotification()
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.episodesChanged();
        }
    }
}