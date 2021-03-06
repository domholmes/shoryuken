﻿using System.Web;
using System.Web.Optimization;

namespace Squirrel
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Uncomment to test bundling locally
            // BundleTable.EnableOptimizations = true;
            
            bundles.Add(new ScriptBundle("~/bundles/libs")
                .Include("~/Scripts/modernizr*")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/bootstrap.js")
                .Include("~/Scripts/bootstrap-timepicker.js")
                .Include("~/Scripts/knockout-{version}.js")
                .Include("~/Scripts/knockoutCustomBindings.js")
                .Include("~/Scripts/prefixfree.js")
                .Include("~/Scripts/q.js")
                .Include("~/Scripts/breeze.min.js")
                .Include("~/Scripts/jquery.signalR-{version}.js")
                .Include("~/Scripts/jquery.confirm.js")
                .Include("~/Scripts/jquery.ba-tinypubsub.js")
                .Include("~/Scripts/expandingTextarea.js"));

            bundles.Add(new ScriptBundle("~/bundles/index")
                .Include("~/Scripts/sr.js")
                .Include("~/Scripts/models/reminder.js")
                .Include("~/Scripts/models/user.js")
                .Include("~/Scripts/dataaccess/reminderRepository.js")
                .Include("~/Scripts/dataaccess/syncNotifier.js")
                .Include("~/Scripts/viewmodels/remindersViewModel.js")
                .Include("~/Scripts/viewmodels/authViewModel.js")
                .Include("~/Scripts/view/indexView.js"));

            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-timepicker.css")
                .Include("~/Content/icons.css")
                .Include("~/Content/main.css")
                .Include("~/Content/site.css")
                );
        }
    }
}