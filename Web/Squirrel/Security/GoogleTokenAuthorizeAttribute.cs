using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Security.Principal;
using System.Net.Http;

namespace Squirrel.Security
{
    public class GoogleTokenAuthorizeAttribute : AuthorizeAttribute
    {
        private const string tokenHeaderName = "tokenId";
        private readonly GoogleIdToken tokenParser;

        public GoogleTokenAuthorizeAttribute()
        {
            tokenParser = new GoogleIdToken();
        }
        
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!Authenticate(actionContext))
            {
                HandleUnauthorizedRequest(actionContext);
            }
        }

        private bool Authenticate(HttpActionContext actionContext)
        {
            GoogleIdToken idToken = actionContext.Request.Headers.GetValues(tokenHeaderName).FirstOrDefault();

            if (string.IsNullOrEmpty(idToken)) return false;

            string userId = idToken.ExtractUserId();

            if (string.IsNullOrEmpty(userId)) return false;

            HttpContext.Current.User = new GenericPrincipal(new GenericIdentity(userId), null);

            return true;
        }

        private string ExtractUserIdFromRequest(HttpRequestMessage httpRequestMessage)
        {
            throw new NotImplementedException();
        }
    }
}