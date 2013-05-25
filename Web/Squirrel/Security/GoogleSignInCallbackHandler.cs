using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;
using System.Web.Security;

namespace Squirrel.Security
{
    public class GoogleSignInCallbackHandler
    {
        private GoogleAuthService authService;
        private GoogleApiService apiService;

        internal GoogleSignInCallbackHandler()
        {
            authService = new GoogleAuthService();
            apiService = new GoogleApiService();
        }
        
        internal bool LoginUser(string userId, string authCode)
        {
            GoogleUser userDetails = authService.GetAuthenticatedUser(authCode);

            if (!userDetails.IsValid)
            {
                return false;
            }

            if (userId != userDetails.Id)
            {
                return false;
            }

            CreateUserIfDoesntExist(userDetails);

            FormsAuthentication.SetAuthCookie(userDetails.Id, true);

            return true;
        }

        private void CreateUserIfDoesntExist(GoogleUser userDetails)
        {
            using (var context = new ReminderContext())
            {
                if (!context.Users.Where(u => u.Username == userDetails.Id).Any())
                {
                    string email = apiService.RetrieveUsersEmail(userDetails.AccessCode);

                    context.Users.Add(new User { Username = userDetails.Id, Email = email });
                    context.SaveChanges();
                }
            }
        }
    }
}