﻿using System.Web;
using System.Web.Optimization;

namespace Squirrel
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/libs")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/bootstrap.js")
                .Include("~/Scripts/bootstrap-timepicker.js")
                .Include("~/Scripts/knockout-2.3.0.js")
                .Include("~/Scripts/knockoutCustomBindings.js")
                .Include("~/Scripts/custom-form-elements.js")
                .Include("~/Scripts/q.js")
                .Include("~/Scripts/breeze*")
                .Include("~/Scripts/jquery.ba-tinypubsub.js"));

            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/base.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-responsive.css")
                .Include("~/Content/bootstrap-timepicker.css")
                .Include("~/Content/icons.css")
                .Include("~/Content/main.css"));
        }
    }
}