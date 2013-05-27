using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Squirrel.Security
{
    public class GoogleIdTokenParser
    {
        public string ExtractUserIdFromToken(string idToken)
        {
            string[] segments = idToken.Split('.');

            string base64EncoodedJsonBody = segments[1];
            int mod4 = base64EncoodedJsonBody.Length % 4;

            if (mod4 > 0)
            {
                base64EncoodedJsonBody += new string('=', 4 - mod4);
            }

            byte[] encodedBodyAsBytes = System.Convert.FromBase64String(base64EncoodedJsonBody);
            string json = System.Text.Encoding.UTF8.GetString(encodedBodyAsBytes);

            return JsonConvert.DeserializeAnonymousType(json, new { sub = "" }).sub;
        }
    }
}