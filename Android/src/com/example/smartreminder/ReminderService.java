package com.example.smartreminder;

import java.text.ParseException;
import java.util.List;

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
		List<Reminder> reminders = ReminderRepository.GetActiveReminders();

		for(Reminder reminder : reminders) 
		{
			Action event = reminder.action;
			
			if(reminder.action.name() == intent.getAction())
			{		
				if(reminder.extra == intent.getStringExtra(EventMapper.extraName))
				{
					if(this.timeChecker.timeMatches(reminder))
					{
						this.notifier.Notify(getApplicationContext(), reminder);
					}
				}
			}
		}
	
		return START_STICKY;
	}
}
