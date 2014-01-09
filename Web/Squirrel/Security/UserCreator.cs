using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;

namespace Squirrel.Security
{
    public class UserCreator
    {
        GoogleApiService apiService;
        ReminderContext context;

        public UserCreator()
        {
            this.apiService = new GoogleApiService();
            this.context = new ReminderContext();
        }

        public virtual void CreateUserIfDoesntExist(GoogleUser userDetails)
        {
            if (!context.Users.Where(u => u.Username == userDetails.Id).Any())
            {
                string email = apiService.RetrieveUsersEmail(userDetails.AccessToken);

                context.Users.Add(new User { Username = userDetails.Id, Email = email, AccessToken = userDetails.AccessToken });
                context.SaveChanges();
            }
        }

        internal void DeleteUserIfExists(string username)
        {
            User user = this.context.Users
                .Where(u => u.Username == username)
                .SingleOrDefault();

            if (user != null)
            {
                this.context.Users.Remove(user);
                this.context.SaveChanges();
            }
        }
    }
}