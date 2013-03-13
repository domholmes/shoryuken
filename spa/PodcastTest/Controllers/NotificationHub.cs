using System;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace PodcastTest.Controllers
{
    public class NotificationHub : Hub
    {
        public void NotifyOthersToUpdate()
        {
            this.Clients.Others.broadcastEpisodesChangedNotification();
        }
    }
}