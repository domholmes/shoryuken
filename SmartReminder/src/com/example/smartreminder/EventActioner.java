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
	private TimeChecker timeChecker;
	private Notifier notifier;
	
	public EventActioner()
	{
		this.timeChecker = new TimeChecker();
		this.notifier = new Notifier();
	}
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		Reminder[] reminders = ReminderRepository.GetActiveReminders();

		for(Reminder reminder : reminders) 
		{
			Action event = reminder.moment.action;
			
			if(reminder.moment.action.name() == intent.getAction())
			{		
				if(reminder.moment.extra == intent.getStringExtra(EventMapper.extraName))
				{
					try
					{
						if(this.timeChecker.timeMatches(reminder.moment))
						{
							this.notifier.Notify(context, reminder);
						}
					} 
					catch (ParseException e)
					{
					
					}
				}
			}
		}
	}
}