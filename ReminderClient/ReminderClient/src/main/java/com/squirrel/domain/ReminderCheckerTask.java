package com.squirrel.domain;

import java.text.ParseException;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import com.squirrel.action.ReminderIntentMatcher;
import com.squirrel.notify.Notifier;
import com.squirrel.sync.ReminderRepository;
import com.squirrel.sync.ReminderSyncerTask;

public class ReminderCheckerTask extends AsyncTask<Intent, Integer, Long>
{
    private Context context;
    private TimeChecker timeChecker;
	private Notifier notifier;
	private ReminderRepository reminderRepository;
	
	public ReminderCheckerTask(Context context)
    {
    	this.context = context;
    	this.timeChecker = new TimeChecker();
		this.notifier = new Notifier();
		this.reminderRepository = new ReminderRepository(context);
    }
	
	protected Long doInBackground(Intent... intents) 
    {
        List<Reminder> reminders = null;
        Boolean changesMade = false;

        try
		{
			reminders = this.reminderRepository.getReminders();
			
			for(Reminder reminder : reminders) 
			{
				if(reminder.enabled)
                {
                    if(intentTriggersReminder(reminder, intents[0]))
                    {
                        this.notifier.Notify(context, reminder.notificationText, reminder.id);

                        if(!reminder.repeat)
                        {
                            reminder.enabled = false;
                            changesMade = true;
                        }
                    }
                }
			}

            if(changesMade)
            {
                this.reminderRepository.putReminders(reminders);

                new ReminderSyncerTask(this.context).execute();
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
