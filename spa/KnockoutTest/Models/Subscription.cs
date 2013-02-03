using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KnockoutTest.Models
{
    public class Subscription
    {
        public int? Id { get; set; }
        
        public string Name { get; set; }

        public string FeedUri { get; set; }

        public List<Episode> Episodes { get; set; }
    }
}