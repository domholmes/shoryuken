package com.example.smartreminder;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

import com.example.smartreminder.models.Moment;
import com.example.smartreminder.models.Reminder;

public class ReminderRepository
{
	private static final String url = "http://192.168.1.7:50625/api/remindermobile/get";
	
	public static Reminder[] GetActiveReminders()
	{
		JSONObject json = new ReminderJsonFetcher().GetJson(url);

		Reminder reminder = new Reminder();
		
		Moment work = new Moment();
		work.days = Arrays.asList(Calendar.MONDAY, Calendar.TUESDAY, Calendar.WEDNESDAY, Calendar.THURSDAY, Calendar.FRIDAY, Calendar.SATURDAY, Calendar.SUNDAY);
		work.action = Action.SmartReminder_Event_WifiConnected;
		work.extra = "BTHub3-THFW";
		work.startTime = "17:00";
		work.endTime = "23:56";

		reminder.moment = work;
		reminder.notificationText = "Remember DVD";
		
		return new Reminder[] { reminder };
	}

}
