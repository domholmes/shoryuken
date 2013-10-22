using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

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
            Clients.OthersInGroup(Context.User.Identity.Name).update();
        }
    }
}