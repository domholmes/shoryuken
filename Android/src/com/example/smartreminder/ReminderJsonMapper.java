package com.example.smartreminder;

import java.util.ArrayList;

import org.json.JSONException;
import org.json.JSONObject;

import com.example.smartreminder.models.Reminder;

public class ReminderJsonMapper
{

	public Reminder CreateReminderFromJson(JSONObject reminderJson) throws JSONException
	{
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
		
		return reminder;
	}

}
