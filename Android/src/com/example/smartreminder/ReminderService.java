package com.example.smartreminder;

import java.text.ParseException;

import com.example.smartreminder.models.Reminder;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

public class ReminderService extends Service
{
	private TimeChecker timeChecker;
	private Notifier notifier;
	
	@Override
	public IBinder onBind(Intent arg0)
	{
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
    public void onCreate()
	{
		this.timeChecker = new TimeChecker();
		this.notifier = new Notifier();
	}
	
	@Override
    public int onStartCommand(Intent intent, int flags, int startid)
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
							this.notifier.Notify(getApplicationContext(), reminder);
						}
					} 
					catch (ParseException e)
					{
					
					}
				}
			}
		}
	
		return START_STICKY;
	}
}
