using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;
using Breeze.WebApi2;
using System.Web.Http;
using Breeze.ContextProvider.EF6;
using Breeze.ContextProvider;

namespace Squirrel.Controllers
{
    public class ReminderContextProvider : EFContextProvider<ReminderContext>
    {
        private readonly ApiController controller;
        
        public ReminderContextProvider(ApiController controller) : base() 
        {
            this.controller = controller;
        }

        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            if (controller.User == null)
            {
                return false;
            }
            
            var reminder = entityInfo.Entity as Reminder;
            string currentUser = controller.User.Identity.Name;
            User user = this.Context.Users.Where(u => u.Username == currentUser).SingleOrDefault();

            if (user == null || reminder == null)
            {
                return false;
            }

            if (entityInfo.EntityState == EntityState.Modified || entityInfo.EntityState == EntityState.Deleted)
            {
                if (reminder.UserId != user.Id)
                {
                    return false;
                }
            }

            if (entityInfo.EntityState == EntityState.Added)
            {
                reminder.UserId = user.Id.Value;
            }

            return true;
        }  
    }
}