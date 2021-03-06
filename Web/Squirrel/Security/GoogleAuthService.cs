﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using Newtonsoft.Json;
using Squirrel.Security;

namespace Squirrel.Security
{
    public class GoogleAuthService
    {
        private const string tokenEndPoint = "https://accounts.google.com/o/oauth2/token";

        public virtual GoogleUser GetAuthenticatedUser(string authToken)
        {
            OAuthResponse response = ExchangeAuthTokenForAccessToken(authToken);

            if (response.IsInvalid) return GoogleUser.InvalidUser;

            string userId = response.id_token.ExtractUserId();

            if (string.IsNullOrEmpty(userId)) return GoogleUser.InvalidUser;

            var user = new GoogleUser
            {
                Id = userId,
                AuthToken = authToken,
                AccessToken = response.access_token
            };

            return user;
        }

        private OAuthResponse ExchangeAuthTokenForAccessToken(string code)
        {
            WebRequest request = WebRequest.Create(tokenEndPoint);

            request.Method = "POST";

            string postData = BuildFormPostData(code);
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);

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
            catch
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

        private string BuildFormPostData(string code)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("code=");
            builder.Append(code);
            builder.Append("&client_id=");
            builder.Append(GoogleClientDetails.CLIENT_ID);
            builder.Append("&client_secret=");
            builder.Append(GoogleClientDetails.SECRET);
            builder.Append("&redirect_uri=");
            builder.Append("postmessage");
            builder.Append("&grant_type=authorization_code");
            return builder.ToString();
        }
    }

    public struct OAuthResponse
    {
        public string access_token { get; set; }

        public GoogleIdToken id_token { get; set; }

        public bool IsInvalid { get; set; }
    }
}
