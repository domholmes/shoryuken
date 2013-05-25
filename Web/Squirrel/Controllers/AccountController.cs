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
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.ClientId = GoogleAuthService.clientId;
            
            return View();
        }

        [AllowAnonymous]
        public HttpStatusCodeResult Callback(string gplusId, string code)
        {
            var callbackHandler = new GoogleSignInCallbackHandler();

            bool callbackOk = callbackHandler.LoginUser(gplusId, code);

            if (!callbackOk)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}
