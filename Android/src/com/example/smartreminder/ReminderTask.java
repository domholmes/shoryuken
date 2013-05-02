package com.example.smartreminder;

import java.net.URL;
import java.text.ParseException;

import com.example.smartreminder.models.Reminder;

import android.content.Intent;
import android.os.AsyncTask;

class DownloadFilesTask extends AsyncTask<Intent, Integer, Long> 
{
    protected Long doInBackground(Intent... intents) 
    {
    	Reminder[] reminders = ReminderRepository.GetActiveReminders();

		for(Reminder reminder : reminders) 
		{
			Action event = reminder.moment.action;
			
			if(reminder.moment.action.name() == intents[0].getAction())
			{		
				if(reminder.moment.extra == intents[0].getStringExtra(EventMapper.extraName))
				{
					try
					{
						if(new TimeChecker().timeMatches(reminder.moment))
						{
							//new Notifier().Notify(getApplicationContext(), reminder);
						}
					} 
					catch (ParseException e)
					{
					
					}
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
