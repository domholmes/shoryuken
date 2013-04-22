using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using System.Net.Http;
using DotNetOpenAuth.AspNet.Clients;

namespace OAuthTest.Filters
{
    public class TokenAuthenticate : AuthorizeAttribute
    {
        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            var client = new AuthenticationClientData(new GoogleOpenIdClient(), "Google", new Dictionary<string, object>());
            OAuthWebSecurity.TryGetOAuthClientData("Google", out client);

            AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication();

            if (!result.IsSuccessful)
            {
                actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            }
            //base.OnAuthorization(actionContext);
        }
    }
}