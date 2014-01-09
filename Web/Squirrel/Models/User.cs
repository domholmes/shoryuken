using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Squirrel.Models
{
    public class User
    {
        public int? Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string NotificationKey { get; set; }

        public string AccessToken { get; set; }
    }
}