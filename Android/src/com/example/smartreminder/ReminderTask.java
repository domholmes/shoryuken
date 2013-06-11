package com.example.smartreminder;

import java.text.ParseException;
import java.util.List;

import org.json.JSONException;

import com.example.smartreminder.models.Reminder;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

class ReminderTask extends AsyncTask<Intent, Integer, Long> 
{
    private Context context;
    private TimeChecker timeChecker;
	private Notifier notifier;
	private ReminderRepository reminderRepository;
	
	public ReminderTask(Context context)
    {
    	this.context = context;
    	this.timeChecker = new TimeChecker();
		this.notifier = new Notifier();
		this.reminderRepository = new ReminderRepository(context);
    }
	
	protected Long doInBackground(Intent... intents) 
    {
		List<Reminder> reminders = null;
		try
		{
			reminders = reminderRepository.GetActiveReminders();
			
			for(Reminder reminder : reminders) 
			{
				if(reminderIsNow(reminder, intents[0]))
				{
					this.notifier.Notify(context, reminder.notificationText);
				}
			}
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}

    	return (long) 0;
    }
	
	private Boolean reminderIsNow(Reminder reminder, Intent intent) throws ParseException
	{
		if(reminder.action.name() == intent.getAction())
		{		
			if(this.timeChecker.timeMatches(reminder))
			{
				return true;
			}
		}
		
		return false;
	}
	
    protected void onProgressUpdate(Integer... progress) {
    }

    protected void onPostExecute(Long result) {
    }
}
