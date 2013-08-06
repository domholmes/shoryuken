package com.squirrel.sync;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

public class ReminderSyncingScheduler
{
    public static void scheduleReminderSyncing(Context context)
    {
        Intent syncReminders = new Intent(context, ReminderSyncerReceiver.class);
        context.sendBroadcast(syncReminders);

        PendingIntent recurringSyncReminders = PendingIntent.getBroadcast(context, 0, syncReminders, PendingIntent.FLAG_CANCEL_CURRENT);
        AlarmManager alarms = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        alarms.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), AlarmManager.INTERVAL_HALF_HOUR, recurringSyncReminders);
    }
}
