package com.squirrel.domain;

import java.text.ParseException;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.text.TextUtils;

import com.squirrel.action.Action;
import com.squirrel.action.IntentRemapperReceiver;
import com.squirrel.notify.Notifier;
import com.squirrel.sync.ReminderStore;

public class ReminderCheckerTask extends AsyncTask<Intent, Integer, Long>
{
    private Context context;
    private TimeChecker timeChecker;
	private Notifier notifier;
	private ReminderStore reminderStore;
	
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
				if(reminderIsNow(reminder, intents[0]))
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
	
	private Boolean reminderIsNow(Reminder reminder, Intent intent) throws ParseException
	{
		String intentAction = intent.getAction();
        String intentActionExtra = intent.getStringExtra(IntentRemapperReceiver.extraName);

        if(intentAction == Action.SmartReminder_Event_ById.name())
        {
            int reminderId = Integer.parseInt(intentActionExtra);

            if(reminder.id == reminderId)
            {
                if(this.timeChecker.timeMatches(reminder))
                {
                    return true;
                }
            }
        }
        else if(reminder.action.name() == intentAction)
		{		
			if(TextUtils.isEmpty(reminder.actionExtra) || reminder.actionExtra.equalsIgnoreCase(intentActionExtra))
            {
                if(this.timeChecker.timeMatches(reminder))
                {
                    return true;
                }
            }
		}
		
		return false;
	}
	
    protected void onProgressUpdate(Integer... progress) {
    }

    protected void onPostExecute(Long result) {
    }
}
