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
            scheduleReminderSyncing(context);
        }
    }

    public static void scheduleReminderSyncing(Context context)
    {
        Intent syncReminders = new Intent(context, ReminderSyncerReceiver.class);
        context.sendBroadcast(syncReminders);

        PendingIntent recurringSyncReminders = PendingIntent.getBroadcast(context, 0, syncReminders, PendingIntent.FLAG_CANCEL_CURRENT);
        AlarmManager alarms = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        alarms.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), AlarmManager.INTERVAL_HALF_HOUR, recurringSyncReminders);
    }
}
