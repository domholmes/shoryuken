using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Squirrel.Security;

namespace Squirrel.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.GoogleSigninClientId = GoogleSignInCallbackHandler.CLIENT_ID;

            var model = new 
            {
                gpSignInParams = new 
                {
                    client_id = GoogleSignInCallbackHandler.CLIENT_ID,
                    scope = GoogleSignInCallbackHandler.REQUIRED_SCOPES
                },
                user = new  
                {
                    isAuthenticated = User.Identity.IsAuthenticated
                }
            };

            var modelJSON = new JavaScriptSerializer().Serialize(model);

            return View(model: modelJSON);
        }
    }
}
