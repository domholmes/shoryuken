using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BreezeTest.Models
{
    public class Episode
    {
        public int? Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string AudioUri { get; set; }

        public DateTime Date { get; set; }
    }
}