﻿/*
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

// Used for HTTP request / response handling.
using System.Net;
using System.Text;
using System.Web;

// Used for endpoint constants
using Google.Apis.Authentication.OAuth2;

// Used to deserialize the OAuth response.
using Newtonsoft.Json;

namespace GPlus_ServerSideFlow
{
    /// <summary>
    /// A utility class used to manually exchange an authorization code for
    /// OAuth2 credentials. When "postmessage" is accepted as a redirect URI for
    /// the client library, you should no longer need to use this utility.
    /// </summary>
    /// @author class@google.com (Gus Class)
    public class GoogleSignInService
    {
        public const string clientId = "311602831768.apps.googleusercontent.com";
        public const string secret = "R-7rTkO8UUgJPRPBRI6OpseD";
        
        /// <summary>
        /// Exchanges an OAuth2 authorization code for OAuth2 credentials.
        /// </summary>
        /// <param name="code">The OAuth2 authorization code from the
        /// sign-in button.</param>
        /// <returns></returns>
        static public OAuthResponseObject ExchangeCode(string code)
        {
            // The request will be made to the authentication server.
            WebRequest request = WebRequest.Create(
                GoogleAuthenticationServer.Description.TokenEndpoint
            );

            // You must use POST for the code exchange.
            request.Method = "POST";

            // Create POST data.
            string postData = FormPostData(code);
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);

            // Set up the POST request for the code exchange.
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            // Perform the POST and retrieve the server response with
            // the access token and/or the refresh token.
            WebResponse response = request.GetResponse();
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            reader.Close();
            dataStream.Close();
            response.Close();

            // Convert the response JSON to an object and return it.
            return JsonConvert.DeserializeObject<OAuthResponseObject>(
                responseFromServer);
        }

        /// <summary>
        /// Creates the string representing the POST data for authorization.
        /// </summary>
        /// <param name="code">The authorization code to be exchanged for
        /// tokens.</param>
        /// <returns>The POST string.</returns>
        static public string FormPostData(string code)
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

    /// <summary>
    /// Encapsulates OAuth 2.0 response data.
    /// </summary>
    public class OAuthResponseObject
    {
        public string access_token;
        public string refresh_token;
        public string code;
        public int expires_in;
        public string id_token;

        public string ExtractPlusId()
        {
            string[] segments = id_token.Split('.');

            string base64EncoodedJsonBody = segments[1];
            int mod4 = base64EncoodedJsonBody.Length % 4;
            if (mod4 > 0)
            {
                base64EncoodedJsonBody += new string('=', 4 - mod4);
            }
            byte[] encodedBodyAsBytes =
                System.Convert.FromBase64String(base64EncoodedJsonBody);
            string json_body =
                System.Text.Encoding.UTF8.GetString(encodedBodyAsBytes);
            IDTokenJsonBodyObject bodyObject =
                JsonConvert.DeserializeObject<IDTokenJsonBodyObject>(json_body);
            string gplus_id = bodyObject.sub;

            return gplus_id;
        }
    }

    /// <summary>
    /// Encapsulates JSON data for ID token body.
    /// </summary>
    public class IDTokenJsonBodyObject
    {
        public string iss;
        public string aud;
        public string at_hash;
        public string azp;
        public string c_hash;
        public string sub;
        public int iat;
        public int exp;
    }
}
