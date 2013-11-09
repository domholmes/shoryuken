using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Script.Serialization;


namespace Squirrel.Security
{
    class GoogleCloudMessagingAppServer
    {
        private readonly string notificationKey;
        private const string GCM_URI = @"https://android.googleapis.com/gcm/send";

        public GoogleCloudMessagingAppServer(string notificationKey)
        {
            if (string.IsNullOrEmpty(notificationKey))
            {
                throw new ArgumentNullException("notificationKey");
            }
            
            this.notificationKey = notificationKey;
        }

        public void Update()
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(GCM_URI);
            httpWebRequest.ContentType = "text/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Headers.Add(HttpRequestHeader.Authorization, string.Format("key={0}", GoogleClientDetails.API_KEY));

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    notification_key = new string[] { notificationKey }
                });

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
                try
                {
                    var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();

                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result = streamReader.ReadToEnd();
                    }
                }
                catch { }
            }
        }
    }
}
