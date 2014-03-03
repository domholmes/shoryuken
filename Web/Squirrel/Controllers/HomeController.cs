using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Squirrel.Security;
using System.Web.Helpers;

namespace Squirrel.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.GoogleSigninClientId = GoogleSignInCallbackHandler.CLIENT_ID;
            ViewBag.AntiForgeryTokenPair = GenerateAntiForgeryToken();
            
            var model = new 
            {
                gpSignInParams = new 
                {
                    client_id = GoogleSignInCallbackHandler.CLIENT_ID,
                    scope = GoogleSignInCallbackHandler.REQUIRED_SCOPES,
                    activity = GoogleSignInCallbackHandler.ACTIVITY
                },
                user = new  
                {
                    isAuthenticated = User.Identity.IsAuthenticated
                }
            };

            var modelJSON = new JavaScriptSerializer().Serialize(model);

            return View(model: modelJSON);
        }

        private String GenerateAntiForgeryToken()
        {
            String cookieToken, formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            
            return cookieToken + ":" + formToken;  
        }
    }
}
