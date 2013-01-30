using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BigShelf.Helpers;

namespace BigShelf.Controllers
{
    [Authorize, SupplyProfileToView]
    public class ProfileController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
