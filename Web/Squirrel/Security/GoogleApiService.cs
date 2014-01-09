using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using Newtonsoft.Json;

namespace Squirrel.Security
{
    public class GoogleApiService
    {
        public string RetrieveUsersEmail(string accessToken)
        {
            string url = string.Format("https://www.googleapis.com/oauth2/v1/userinfo?access_token={0}", accessToken);

            string responseFromServer = Post(url);

            if (responseFromServer != null)
            {
                return JsonConvert.DeserializeAnonymousType(responseFromServer, new { email = "" }).email;
            }
            else 
            { 
                return null; 
            }
        }

        public string DisconnectUser(string accessToken)
        {
            string url = string.Format("https://accounts.google.com/o/oauth2/revoke?token={0}", accessToken);

            string responseFromServer = Post(url);

            if (responseFromServer != null)
            {
                return null;
            }
            else
            {
                return "error";
            }
        }

        public string Post(string url)
        {
            WebRequest request = WebRequest.Create(url);
            request.ContentType = "application/json";
            request.Method = "GET";
            
            return GetResponseString(request);
        }

        private string GetResponseString(WebRequest request)
        {
            WebResponse response;

            try
            {
                response = request.GetResponse();
            }
            catch (WebException)
            {
                return null;
            }

            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            reader.Close();
            dataStream.Close();
            response.Close();

            return responseFromServer;
        }
    }
}