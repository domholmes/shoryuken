using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using Google.Apis.Authentication.OAuth2;
using Newtonsoft.Json;
using Squirrel.Security;

namespace Squirrel.Security
{
    public class GoogleAuthService
    {
        public const string clientId = "714250926431.apps.googleusercontent.com";
        private const string secret = "";

        internal GoogleUser GetAuthenticatedUser(string authCode)
        {
            OAuthResponse response = ExchangeAuthCodeForAccessCode(authCode);

            if (response.IsInvalid)
            {
                return null;
            }

            var user = new GoogleUser
            {
                Id = ExtractUserId(response.id_token),
                AccessCode = response.access_token
            };

            return user;
        }

        private OAuthResponse ExchangeAuthCodeForAccessCode(string code)
        {
            // The request will be made to the authentication server.
            WebRequest request = WebRequest.Create(
                GoogleAuthenticationServer.Description.TokenEndpoint
            );

            // You must use POST for the code exchange.
            request.Method = "POST";

            // Create POST data.
            string postData = BuildFormPostData(code);
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);

            // Set up the POST request for the code exchange.
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            
            WebResponse response;

            try
            {
                response = request.GetResponse();
            }
            catch (WebException)
            {
                return new OAuthResponse() { IsInvalid = true };
            }
            
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            reader.Close();
            dataStream.Close();
            response.Close();

            return JsonConvert.DeserializeObject<OAuthResponse>(responseFromServer);
        }

        private string ExtractUserId(string idToken)
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

        private string BuildFormPostData(string code)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("code=");
            builder.Append(code);
            builder.Append("&client_id=");
            builder.Append(clientId);
            builder.Append("&client_secret=");
            builder.Append(secret);
            builder.Append("&redirect_uri=");
            builder.Append("postmessage");
            builder.Append("&grant_type=authorization_code");
            return builder.ToString();
        }
    }

    public class OAuthResponse
    {
        public string access_token { get; set; }

        public string id_token { get; set; }

        public bool IsInvalid { get; set; }
    }
}
