package com.example.smartreminder;

import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.smartreminder.models.Reminder;

public class ReminderRepository
{	
	private ReminderJsonFetcher jsonFetcher;
	private ReminderJsonMapper jsonMapper;
	
	public ReminderRepository()
	{
		jsonFetcher = new ReminderJsonFetcher();
		jsonMapper = new ReminderJsonMapper();
	}
	
	public ArrayList<Reminder> GetActiveReminders() throws JSONException
	{
		JSONArray jArray = jsonFetcher.getJson();
		
		ArrayList<Reminder> reminders = new ArrayList<Reminder>();
		
		for(int i=0; i< jArray.length(); i++)
		{			
			JSONObject reminderJson = jArray.getJSONObject(i);
				
			Reminder reminder = jsonMapper.CreateReminderFromJson(reminderJson);
				
			reminders.add(reminder);

		}
		
		return reminders;
	}

}
