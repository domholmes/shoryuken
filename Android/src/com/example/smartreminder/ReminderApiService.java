package com.example.smartreminder;

import android.content.Context;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.net.HttpURLConnection;

public class ReminderApiService
{
    private static final String baseUri = "http://jlbceramicart.com/api/remindermobile/";
    private JsonArrayBuilder arrayBuilder;
    private IdTokenStore tokenStore;
    private HttpClient httpClient;

    public ReminderApiService(Context context)
    {
        this.arrayBuilder = new JsonArrayBuilder();
        this.tokenStore = new IdTokenStore(context);
        this.httpClient = new DefaultHttpClient();
    }

    public JSONArray getRemindersJson() throws IOException, JSONException
    {
        JSONArray array = new JSONArray();

        String idToken = this.tokenStore.getToken();

        if(idToken != null)
        {
            HttpGet get = new HttpGet(baseUri);
            addTokenHeader(get, idToken);

            HttpResponse response = this.httpClient.execute(get);

            array = this.arrayBuilder.build(response);
        }

        return array;
    }

    public Boolean disableReminder(int reminderId) throws IOException
    {
        String idToken = this.tokenStore.getToken();

        if(idToken == null)
        {
            return false;
        }

        HttpPost post = new HttpPost(baseUri + "/" + reminderId);
        addTokenHeader(post, idToken);

        HttpResponse response = this.httpClient.execute(post);

        if(response.getStatusLine().getStatusCode() != HttpURLConnection.HTTP_OK)
        {
            return false;
        }

        return true;
    }

    private void addTokenHeader(HttpRequestBase request, String idToken)
    {
        request.setHeader("idToken", idToken);
    }

}
