using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace Squirrel.Security
{
    public class FormsAuthenticator
    {
        public virtual void SetAuthCookie(string userId)
        {
            FormsAuthentication.SetAuthCookie(userId, true);
        }
    }
}