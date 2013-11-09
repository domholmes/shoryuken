using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Squirrel.Security;
using Squirrel.Models;

namespace Squirrel.Controllers
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override Task OnConnected()
        {
            Groups.Add(Context.ConnectionId, Context.User.Identity.Name);
            
            return base.OnConnected();
        }

        public override Task  OnDisconnected()
        {
            Groups.Remove(Context.ConnectionId, Context.User.Identity.Name);

            return base.OnDisconnected();
        }

        public void PushUpdate()
        {
            string userName = Context.User.Identity.Name;
            
            // Update SignalR web clients
            Clients.OthersInGroup(userName).update();

            string notificationKey = GetGoogleCloudMessagingNotificationKey(userName);

            if (!string.IsNullOrEmpty(notificationKey))
            {
                // Update Google Cloud Messaging mobile clients
                new GoogleCloudMessagingAppServer(notificationKey).Update();
            }
        }

        private string GetGoogleCloudMessagingNotificationKey(string userName)
        {
            User user = new ReminderContext()
                .Users
                .Where(u => u.Username == userName)
                .SingleOrDefault();

            if (user == null)
            {
                throw new Exception("No user found matching {0} when attempting to push a Google Cloud Messaging update");
            }

            return user.NotificationKey;
        }
    }
}