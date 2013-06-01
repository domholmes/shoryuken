using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;
using System.Web.Security;

namespace Squirrel.Security
{
    public class GoogleSignInCallbackHandler
    {
        private GoogleAuthService authService;
        private UserCreator userCreator;
        private FormsAuthenticator formsAuth;
        public const string ClientId = GoogleAuthService.clientId;
        public const string RequiredScopes = "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email"; 

        public GoogleSignInCallbackHandler()
        {
            this.authService = new GoogleAuthService();
            this.userCreator = new UserCreator();
            this.formsAuth = new FormsAuthenticator();
        }

        public GoogleSignInCallbackHandler(GoogleAuthService authService, UserCreator userCreator, FormsAuthenticator formsAuth)
        {
            this.authService = authService;
            this.userCreator = userCreator;
            this.formsAuth = formsAuth;
        }
        
        public bool LoginUser(string authCode)
        {
            GoogleUser userDetails = authService.GetAuthenticatedUser(authCode);

            if (!userDetails.IsValid)
            {
                return false;
            }

            userCreator.CreateUserIfDoesntExist(userDetails);

            formsAuth.SetAuthCookie(userDetails.Id);

            return true;
        }

        
    }
}