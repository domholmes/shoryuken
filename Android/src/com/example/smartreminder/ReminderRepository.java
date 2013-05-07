package com.example.smartreminder;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.smartreminder.models.Reminder;

public class ReminderRepository
{
	private static final String url = "http://192.168.1.7:50625/api/remindermobile/get";
	
	public static ArrayList<Reminder> GetActiveReminders()
	{
		JSONArray jArray = new ReminderJsonFetcher().GetJson(url);
		
		ArrayList<Reminder> reminders = new ArrayList<Reminder>();
		
		for(int i=0; i< jArray.length(); i++)
		{			
			try
			{
				JSONObject reminderJson = jArray.getJSONObject(i);
				
				String message = reminderJson.getString("message");
				String startTime = reminderJson.getString("startTime").substring(11);
				String endTime = reminderJson.getString("endTime").substring(11);
				int eventId = reminderJson.getInt("eventId");
				String days = reminderJson.getString("days");		
				
				Reminder reminder = new Reminder();
				
				reminder.notificationText = message;
				reminder.startTime = startTime;
				reminder.endTime = endTime;
				reminder.action = Action.values()[eventId];
				reminder.days = new ArrayList<Integer>();
				
				for(char day: days.toCharArray())
				{
					reminder.days.add(Character.getNumericValue(day));
				}
				
				reminders.add(reminder);
			} 
			catch (JSONException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return reminders;
	}

}
