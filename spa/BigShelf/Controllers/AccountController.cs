using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using BigShelf.Models;

namespace BigShelf.Controllers
{
    public class AccountController : Controller
    {
        private readonly BigShelfEntities db = new BigShelfEntities();

        public ActionResult LogIn() {
            return View();
        }

        [HttpPost]
        public ActionResult LogIn(LoginModel loginModel, string returnUrl) {
            var profile = GetProfileByCredentials(loginModel.Username, loginModel.Password);
            if (profile == null)
                ModelState.AddModelError(string.Empty, "Incorrect username or password");

            if (ModelState.IsValid) {
                FormsAuthentication.SetAuthCookie(profile.AspNetUserGuid, loginModel.Persistent);
                return Redirect(returnUrl ?? "~/");
            } else {
                return View();
                }
            }

        public ActionResult LogOut() {
            FormsAuthentication.SignOut();
                    return RedirectToAction("Index", "Home");
                }

        private Profile GetProfileByCredentials(string username, string password) {
            // Dummy authentication based on single hard-coded password. In a real app, you'd store per-user hashed passwords in the DB.
            if ((password ?? string.Empty).Trim() != "abc123")
                return null;

            return db.Profiles.FirstOrDefault(p => p.EmailAddress == (username ?? string.Empty).Trim());
        }
    }
}
