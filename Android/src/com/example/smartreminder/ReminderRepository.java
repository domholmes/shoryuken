package com.example.smartreminder;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import com.example.smartreminder.models.Moment;
import com.example.smartreminder.models.Reminder;

public class ReminderRepository
{
	public static Reminder[] GetActiveReminders()
	{
		HttpClient httpclient = new DefaultHttpClient();

	    HttpGet httpget = new HttpGet("http://localhost/api/values");
		
		try
		{
			HttpResponse response = httpclient.execute(httpget);
		} catch (ClientProtocolException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


		
		
		
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
