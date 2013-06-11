package com.example.smartreminder;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.smartreminder.models.Reminder;

public class ReminderRepository
{	
	private ReminderJsonFetcher jsonFetcher;
	private ReminderJsonMapper jsonMapper;
    private IdTokenStore tokenStore;
    private Context context;
	
	public ReminderRepository(Context context)
	{
		this.jsonFetcher = new ReminderJsonFetcher();
		this.jsonMapper = new ReminderJsonMapper();
        this.tokenStore = new IdTokenStore(context);
        this.context = context;
	}
	
	public ArrayList<Reminder> GetActiveReminders() throws JSONException
	{
		String idToken = this.tokenStore.getToken();

        if(idToken == null)
        {
            return new ArrayList<Reminder>();
        }

        JSONArray jArray = jsonFetcher.getJson(this.context, idToken);
		
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
