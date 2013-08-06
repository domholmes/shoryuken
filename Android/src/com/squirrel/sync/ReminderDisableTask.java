package com.squirrel.sync;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import java.io.IOException;

public class ReminderDisableTask extends AsyncTask<Intent, Integer, Void>
{
    private Context context;
    private ReminderApiService apiService;
    private NotificationManager notificationManager;

    public ReminderDisableTask(Context context)
    {
        this.context = context;
        this.apiService = new ReminderApiService(context);
        this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }


    @Override
    protected Void doInBackground(Intent... intents)
    {
        int reminderId = Integer.parseInt(intents[0].getDataString().substring(5));

        try
        {
            Boolean success = this.apiService.disableReminder(reminderId);

            if(success)
            {
                notificationManager.cancel(reminderId);
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return null;
    }
}
