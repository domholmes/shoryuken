using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GPlus_ServerSideFlow;
using Squirrel.Models;
using System.Web.Security;
using System.Net;

namespace Squirrel.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {   
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.ClientId = GoogleSignInService.clientId;
            
            return View();
        }

        [AllowAnonymous]
        public HttpStatusCodeResult Callback(string gplusId, string code)
        {
            OAuthResponseObject response = GoogleSignInService.ExchangeSingleUseCode(code);

            if (!response.IsValid)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            string plusId = response.ExtractPlusId();

            if (gplusId != plusId)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            FormsAuthentication.SetAuthCookie(plusId, true);

            using (var context = new ReminderContext())
            {
                if (!context.Users.Where(u => u.Username == plusId).Any())
                {
                    context.Users.Add(new User { Username = plusId, Email = "bob@bob.com" });
                    context.SaveChanges();    
                }
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}
