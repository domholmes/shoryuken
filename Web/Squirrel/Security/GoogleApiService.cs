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
        private const string userInfoEndPoint = "https://www.googleapis.com/oauth2/v1/userinfo";
        
        public string RetrieveUsersEmail(string accessCode)
        {
            string url = string.Format("{0}?access_token={1}", userInfoEndPoint, accessCode);

            WebRequest request = WebRequest.Create(url);

            string responseFromServer = GetResponseString(request);

            if (responseFromServer != null)
            {
                return JsonConvert.DeserializeAnonymousType(responseFromServer, new { email = "" }).email;
            }
            else 
            { 
                return null; 
            }
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