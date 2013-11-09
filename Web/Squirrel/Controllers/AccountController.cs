﻿using System;
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
            ViewBag.ClientId = GoogleSignInCallbackHandler.ClientId;
            ViewBag.RequiredScopes = GoogleSignInCallbackHandler.RequiredScopes;
            
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
        public virtual ActionResult LogOff()
        {
            FormsAuthentication.SignOut();

            foreach (var cookie in Request.Cookies.AllKeys)
            {
                Request.Cookies.Remove(cookie);
            }
            foreach (var cookie in Response.Cookies.AllKeys)
            {
                Response.Cookies.Remove(cookie);
            }

            return RedirectToAction("Login");
        }
    }
}
