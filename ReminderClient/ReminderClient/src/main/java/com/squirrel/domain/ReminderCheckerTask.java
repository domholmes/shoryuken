package com.squirrel.domain;

import java.text.ParseException;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import com.squirrel.action.IntentRemapperReceiver;
import com.squirrel.action.ReminderIntentMatcher;
import com.squirrel.notify.Notifier;
import com.squirrel.sync.ReminderStore;

public class ReminderCheckerTask extends AsyncTask<Intent, Integer, Long>
{
    private Context context;
    private TimeChecker timeChecker;
	private Notifier notifier;
	private ReminderStore reminderStore;
    private ReminderIntentMatcher reminderMatcher;
	
	public ReminderCheckerTask(Context context)
    {
    	this.context = context;
    	this.timeChecker = new TimeChecker();
		this.notifier = new Notifier();
		this.reminderStore = new ReminderStore(context);
    }
	
	protected Long doInBackground(Intent... intents) 
    {
        List<Reminder> reminders = null;
		try
		{
			reminders = this.reminderStore.getReminders();
			
			for(Reminder reminder : reminders) 
			{
				if(intentTriggersReminder(reminder, intents[0]))
				{
                    this.notifier.Notify(context, reminder.notificationText, reminder.id);
				}
			}
		} 
		catch (Exception e)
		{
			e.printStackTrace();
		}

    	return (long) 0;
    }
	
	private Boolean intentTriggersReminder(Reminder reminder, Intent intent) throws ParseException
	{
        ReminderIntentMatcher intentMatcher = new ReminderIntentMatcher(intent);

        if(intentMatcher.isIdMatch(reminder) || intentMatcher.isActionMatch(reminder))
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
