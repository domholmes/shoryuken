package com.example.smartreminder;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver
{
    @Override
    public void onReceive(Context context, Intent intent)
    {
        Boolean hasToken = new IdTokenStore(context).hasToken();

        if(hasToken)
        {
            ReminderSyncingScheduler.scheduleReminderSyncing(context);
        }
    }
}
