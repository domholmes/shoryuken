using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Squirrel.Security
{
    public struct GoogleUser
    {
        public string Id { get; set; }

        public string AccessCode { get; set; }

        public bool IsValid
        {
            get
            {
                return !string.IsNullOrEmpty(Id);
            }
        }

        public static GoogleUser InvalidUser
        {
            get { return new GoogleUser(); }
        }
    }
}