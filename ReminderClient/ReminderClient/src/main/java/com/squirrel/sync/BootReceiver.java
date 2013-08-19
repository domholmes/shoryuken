package com.squirrel.sync;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.squirrel.auth.IdTokenStore;

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
