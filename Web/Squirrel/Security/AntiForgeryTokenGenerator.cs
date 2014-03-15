using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace Squirrel.Security
{
    public class AntiForgeryTokenGenerator
    {
        public static String Generate()
        {
            String cookieToken, formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);

            return cookieToken + ":" + formToken;
        }
    }
}