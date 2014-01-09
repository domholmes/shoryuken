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
        public const string CLIENT_ID = GoogleClientDetails.CLIENT_ID;
        public const string REQUIRED_SCOPES = "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email";
        public const string ACTIVITY = "http://schemas.google.com/CheckInActivity";

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
            GoogleUser user = authService.GetAuthenticatedUser(authCode);

            if (!user.IsValid)
            {
                return false;
            }

            userCreator.CreateUserIfDoesntExist(user);

            formsAuth.SetAuthCookie(user.Id);

            return true;
        }

        
    }
}