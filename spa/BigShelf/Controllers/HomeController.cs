using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using BigShelf.Helpers;

namespace BigShelf.Controllers
{
    [Authorize, SupplyProfileToView]
    public class HomeController : Controller
    {
        public ActionResult Index() {
            return View();
        }
    }
}
