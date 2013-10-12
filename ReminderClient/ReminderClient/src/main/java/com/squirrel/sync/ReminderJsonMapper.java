package com.squirrel.sync;

import com.squirrel.action.Action;
import com.squirrel.domain.Reminder;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ReminderJsonMapper
{
    public ArrayList<Reminder> createRemindersFromJson(JSONArray jArray) throws JSONException
    {
        ArrayList<Reminder> reminders = new ArrayList<Reminder>();

        for(int i=0; i< jArray.length(); i++)
        {
            JSONObject reminderJson = jArray.getJSONObject(i);

            Reminder reminder = this.createReminderFromJson(reminderJson);

            reminders.add(reminder);
        }

        return reminders;
    }

	private Reminder createReminderFromJson(JSONObject reminderJson) throws JSONException
	{
		int id = reminderJson.getInt("id");
        String message = reminderJson.getString("message");
		String startTime = reminderJson.getString("startTime");
		String endTime = reminderJson.getString("endTime");
		int eventId = reminderJson.getInt("actionId");
        String ssid = reminderJson.isNull("ssid") ? null: reminderJson.getString("ssid");
        String latLong = reminderJson.isNull("latLong") ? null: reminderJson.getString("latLong");
        String days = reminderJson.getString("days");
        boolean enabled = reminderJson.getBoolean("enabled");
        boolean repeat = reminderJson.getBoolean("repeat");

		Reminder reminder = new Reminder();
		
		reminder.id = id;
        reminder.notificationText = message;
		reminder.startTime = startTime;
		reminder.endTime = endTime;
		reminder.action = Action.values()[eventId];
        reminder.ssid = ssid;
        reminder.latLong = latLong;
        reminder.days = new ArrayList<Integer>();
        reminder.enabled = enabled;
        reminder.repeat = repeat;

		for(char day: days.toCharArray())
		{
			reminder.days.add(Character.getNumericValue(day));
		}
		
		return reminder;
	}
}
