using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;
using Breeze.WebApi;
using System.Web.Http;

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
            var reminder = entityInfo.Entity as Reminder;
            string username = controller.User.Identity.Name;

            User user = this.Context.Users.Where(u => u.Username == username).SingleOrDefault();

            if (user == null || reminder == null)
            {
                return false;
            }

            reminder.User = user;

            return true;
        }  
    }
}