package com.example.smartreminder;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

public class ReminderJsonFetcher
{
	public JSONArray GetJson(String url)
	{
		HttpClient httpclient = new DefaultHttpClient();

	    HttpGet httpget = new HttpGet(url);
	    httpget.setHeader("Content-type", "application/json");
	    
	    InputStream inputStream = null;
		String result = null;

		try
		{
			
			HttpResponse response = httpclient.execute(httpget);           
			HttpEntity entity = response.getEntity();

			inputStream = entity.getContent();

			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"), 8);
			StringBuilder sb = new StringBuilder();

			String line = null;
			while ((line = reader.readLine()) != null)
			{
			    sb.append(line + "\n");
			}
			
			result = sb.toString();
			
			return new JSONArray(result);
		} 
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return new JSONArray();
	}
}
