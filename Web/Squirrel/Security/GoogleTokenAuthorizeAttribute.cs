using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Security.Principal;
using System.Net.Http;
using System.Threading;

namespace Squirrel.Security
{
    public class GoogleTokenAuthorizeAttribute : AuthorizeAttribute
    {
        private const string tokenHeaderName = "idToken";
        private readonly GoogleIdTokenVerifier tokenVerifier;

        public GoogleTokenAuthorizeAttribute()
        {
            tokenVerifier = new GoogleIdTokenVerifier();
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

            if (!tokenIsOk(idToken)) return false;

            string userId = idToken.ExtractUserId();

            if (string.IsNullOrEmpty(userId)) return false;

            HttpContext.Current.User = new GenericPrincipal(new GenericIdentity(userId), null);
            Thread.CurrentPrincipal = HttpContext.Current.User; ;

            return true;
        }

        private bool tokenIsOk(GoogleIdToken idToken)
        {
            if (!idToken.HasValue) return false;

            bool tokenIsValid = tokenVerifier.Verify(idToken);

            if (!tokenIsValid) return false;

            return true;
        }
    }
}