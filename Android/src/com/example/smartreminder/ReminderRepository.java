package com.example.smartreminder;

import android.content.Context;

import java.io.IOException;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ReminderRepository
{
    private Context context;
    private ReminderApiService apiService;
	private ReminderJsonMapper jsonMapper;
	
	public ReminderRepository(Context context)
	{
        this.context = context;
        this.apiService = new ReminderApiService(context);
		this.jsonMapper = new ReminderJsonMapper();
	}
	
	public ArrayList<Reminder> GetActiveReminders() throws JSONException, IOException
    {
		JSONArray jArray = this.apiService.getRemindersJson();
		
		ArrayList<Reminder> reminders = new ArrayList<Reminder>();
		
		for(int i=0; i< jArray.length(); i++)
		{			
			JSONObject reminderJson = jArray.getJSONObject(i);
				
			Reminder reminder = this.jsonMapper.CreateReminderFromJson(reminderJson);
				
			reminders.add(reminder);
		}
		
		return reminders;
	}
}
