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

        public UserCreator(GoogleApiService apiService, ReminderContext context)
        {
            this.apiService = apiService;
            this.context = context;
        }
        
        public virtual void CreateUserIfDoesntExist(GoogleUser userDetails)
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