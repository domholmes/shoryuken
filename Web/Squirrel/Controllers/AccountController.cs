using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Squirrel.Models;
using System.Web.Security;
using System.Net;
using Squirrel.Security;

namespace Squirrel.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {      
        [AllowAnonymous]
        public ActionResult Login(string message)
        {
            ViewBag.Message = message;
            ViewBag.ClientId = GoogleSignInCallbackHandler.CLIENT_ID;
            ViewBag.RequiredScopes = GoogleSignInCallbackHandler.REQUIRED_SCOPES;
            
            return View();
        }

        [AllowAnonymous]
        public HttpStatusCodeResult Callback(string code)
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

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [AllowAnonymous]
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

            FormsAuthentication.SignOut();            

            return disconnectWasSuccessful ? 
                RedirectToAction("Login") :
                RedirectToAction("Login", new { message = "For some crazy reason we were unable to disconnect Squirrel from your Google account. Don't fret, you can disconnect the app here https://plus.google.com/apps" }); 
        }
    }
}
