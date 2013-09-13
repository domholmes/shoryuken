package com.squirrel.sync;

import com.squirrel.action.Action;
import com.squirrel.domain.Reminder;

import java.util.ArrayList;

import org.json.JSONException;
import org.json.JSONObject;

public class ReminderJsonMapper
{

	public Reminder CreateReminderFromJson(JSONObject reminderJson) throws JSONException
	{
		int id = reminderJson.getInt("id");
        String message = reminderJson.getString("message");
		String startTime = reminderJson.getString("startTime");
		String endTime = reminderJson.getString("endTime");
		int eventId = reminderJson.getInt("actionId");
        String ssid = reminderJson.isNull("ssid") ? null: reminderJson.getString("ssid");
        String latLong = reminderJson.isNull("latLong") ? null: reminderJson.getString("latLong");
        String days = reminderJson.getString("days");
		
		Reminder reminder = new Reminder();
		
		reminder.id = id;
        reminder.notificationText = message;
		reminder.startTime = startTime;
		reminder.endTime = endTime;
		reminder.action = Action.values()[eventId];
        reminder.ssid = ssid;
        reminder.latLong = latLong;
        reminder.days = new ArrayList<Integer>();

		for(char day: days.toCharArray())
		{
			reminder.days.add(Character.getNumericValue(day));
		}
		
		return reminder;
	}

}
