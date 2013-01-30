using System.Linq;
using System.Web.Mvc;
using BigShelf.Models;

namespace BigShelf.Helpers
{
    /// <summary>
    /// Ensures that, where applicable, ViewBag.UserProfile is populated to match the authenticated user
    /// </summary>
    public class SupplyProfileToViewAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext) {
            // Guard clauses - only proceed if authenticated and about to render a view
            if (!filterContext.RequestContext.HttpContext.Request.IsAuthenticated)
                return;
            if (!(filterContext.Result is ViewResult))
                return;

            var db = new BigShelfEntities();
            var profile = db.Profiles.SingleOrDefault(p => p.AspNetUserGuid == filterContext.HttpContext.User.Identity.Name);
            ((ViewResult)filterContext.Result).ViewBag.UserProfile = profile;
        }
    }
}