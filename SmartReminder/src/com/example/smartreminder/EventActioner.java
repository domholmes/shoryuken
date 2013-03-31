package com.example.smartreminder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.example.smartreminder.models.Moment;
import com.example.smartreminder.models.Reminder;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

public class EventActioner extends BroadcastReceiver
{
	private EventChecker eventChecker;
	private TimeChecker timeChecker;
	
	public EventActioner()
	{
		this.eventChecker = new EventChecker();
		this.timeChecker = new TimeChecker();
	}
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		Reminder[] reminders = ReminderRepository.GetActiveReminders();

		for(Reminder reminder : reminders)
		{
			if(this.eventChecker.eventMatches(context, intent, reminder.moment))
			{		
				try
				{
					if(this.timeChecker.timeMatches(reminder.moment))
					{
						showNotification(context, reminder.notificationText);
					}
				} 
				catch (ParseException e)
				{
					
				}
			}
		}
	}
	
	private void showNotification(Context context, String message)
	{
		NotificationCompat.Builder mBuilder = 
				new NotificationCompat.Builder(context)
					.setSmallIcon(R.drawable.ic_launcher)
					.setContentText(message)
					.setContentTitle("My notification");

		PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
				new Intent(),
				PendingIntent.FLAG_UPDATE_CURRENT);
		
		mBuilder.setContentIntent(contentIntent);

		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		
		mNotificationManager.notify(1, mBuilder.build());
	}
}