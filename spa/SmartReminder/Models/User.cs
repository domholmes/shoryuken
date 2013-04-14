using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;
using System.Web.Security;

namespace SmartReminder.Models
{
    public class User : MembershipUser
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string Username
        {
            get
            {
                return this.Email.ToLower();
            }
        }

        public byte[] PasswordHash { get; set; }

        public List<Reminder> Reminders { get; set; }

        public IIdentity Identity
        {
            get { throw new NotImplementedException(); }
        }

        public bool IsInRole(string role)
        {
            throw new NotImplementedException();
        }
    }
}