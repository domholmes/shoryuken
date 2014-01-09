using Squirrel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Squirrel.Security
{
    public class GoogleAppDisconnector
    {
        internal bool Disconnect(string user)
        {
            string usersAccessToken = GetUsersAccessToken(user);

            if (string.IsNullOrEmpty(usersAccessToken))
            {
                return false;
            }

            string error = AttemptDisconnect(usersAccessToken);

            if(!string.IsNullOrEmpty(error))
            {
                Logger.Log(null, string.Format("There was a problem calling Google's disconnect service for user {0}.", user));
                
                return false;
            }

            return true;
        }

        internal string GetUsersAccessToken(string username)
        {
            var context = new ReminderContext();

            User user = context.Users.Where(r => r.Username == username).SingleOrDefault();

            if (user == null)
            {
                Logger.Log(null, string.Format("Unable to find user {0} when attempting to disconnect them.", username));
                return null;
            }

            if(string.IsNullOrEmpty(user.AccessToken))
            {
                Logger.Log(null, string.Format("The user {0} doesn't have an access token.", user));
                return null;
            }

            return user.AccessToken;
        }

        private string AttemptDisconnect(string usersAccessToken)
        {
            string error = new GoogleApiService().DisconnectUser(usersAccessToken);

            return error;
        }
    }
}