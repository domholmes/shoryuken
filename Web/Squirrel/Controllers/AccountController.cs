using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Squirrel.Models;
using System.Web.Security;
using System.Net;
using Squirrel.Security;
using Squiirel.Security;

namespace Squirrel.Controllers
{
    [Authorize]
    [ValidateAntiForgeryTokenOnPost]
    public class AccountController : Controller
    {      
        [AllowAnonymous]
        public ActionResult Callback(string code)
        {
            bool loginOk = false;

            try
            {
                loginOk = new GoogleSignInCallbackHandler().LoginUser(code);
            }
            catch(Exception e) 
            {
                Logger.Log(null, e);            
            }

            if (!loginOk)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            RenewCurrentUser();
            string token = AntiForgeryTokenGenerator.Generate();

            return Content(token);
        }

        [HttpPost]
        public virtual ActionResult Disconnect()
        {
            bool disconnectWasSuccessful = false;
            
            string currentUser = this.User.Identity.Name;
            
            if(string.IsNullOrEmpty(currentUser))
            {
                Logger.Log(null, "Attempted to disconnect a user but couldn't determine the current logged in username.");
            }
            else
            {
                disconnectWasSuccessful = new GoogleAppDisconnector().Disconnect(currentUser);
                new UserCreator().DeleteUserIfExists(currentUser);
            }

            return SignOut();
        }

        [HttpPost]
        public virtual ActionResult SignOut()
        {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        private void RenewCurrentUser()
        {
            System.Web.HttpCookie authCookie =
                System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                FormsAuthenticationTicket authTicket = null;
                authTicket = FormsAuthentication.Decrypt(authCookie.Value);

                if (authTicket != null && !authTicket.Expired)
                {
                    FormsAuthenticationTicket newAuthTicket = authTicket;

                    if (FormsAuthentication.SlidingExpiration)
                    {
                        newAuthTicket = FormsAuthentication.RenewTicketIfOld(authTicket);
                    }
                    string userData = newAuthTicket.UserData;
                    string[] roles = userData.Split(',');

                    System.Web.HttpContext.Current.User =
                        new System.Security.Principal.GenericPrincipal(new FormsIdentity(newAuthTicket), roles);
                }
            }
        }

    }
}
