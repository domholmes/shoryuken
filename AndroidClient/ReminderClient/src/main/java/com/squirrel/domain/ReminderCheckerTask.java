package com.squirrel.domain;

import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import com.squirrel.auth.ActivityPoster;
import com.squirrel.notify.Notifier;
import com.squirrel.sync.ReminderRepository;
import com.squirrel.sync.ReminderSyncerTask;

public class ReminderCheckerTask extends AsyncTask<Intent, Integer, Long>
{
    private Context context;
    private ReminderTimeMatcher timeChecker;
	private Notifier notifier;
	private ReminderRepository reminderRepository;
    private ActivityPoster activityPoster;
	
	public ReminderCheckerTask(Context context)
    {
    	this.context = context;
    	this.timeChecker = new ReminderTimeMatcher();
		this.notifier = new Notifier(context);
		this.reminderRepository = new ReminderRepository(context);
        this.activityPoster = new ActivityPoster(context);
    }
	
	protected Long doInBackground(Intent... intents) 
    {
        try
		{
			List<Reminder> reminders = this.reminderRepository.getReminders();
            Boolean changesMade = false;

			for(Reminder reminder : reminders) 
			{
                if(reminder.shouldNotify(intents[0]))
                {
                    this.notifier.Notify(reminder.notificationText, reminder.id, reminder.repeat);

                    if(!reminder.repeat)
                    {
                        reminder.enabled = false;
                        changesMade = true;
                    }

                    if(reminder.shouldPostActivity())
                    {
                        this.activityPoster.addNewCheckIn(reminder);
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
	
    protected void onProgressUpdate(Integer... progress) {
    }

    protected void onPostExecute(Long result) {
    }
}
