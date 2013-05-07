package com.example.smartreminder;

import java.net.URL;
import java.text.ParseException;
import java.util.List;

import com.example.smartreminder.models.Reminder;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

class DownloadFilesTask extends AsyncTask<Intent, Integer, Long> 
{
    private Context context;
	
	public DownloadFilesTask(Context context)
    {
    	this.context = context;
    }
	
	protected Long doInBackground(Intent... intents) 
    {
    	List<Reminder> reminders = ReminderRepository.GetActiveReminders();

		for(Reminder reminder : reminders) 
		{
			Action event = reminder.action;
			
			if(reminder.action.name() == intents[0].getAction())
			{		
				if(new TimeChecker().timeMatches(reminder))
				{
					new Notifier().Notify(this.context, reminder);
				}
			}
		}
    	
    	return (long) 0;
    }

    protected void onProgressUpdate(Integer... progress) {
    }

    protected void onPostExecute(Long result) {
    }
}
