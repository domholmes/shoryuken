package com.squirrel.sync;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class ReminderSyncerReceiver extends BroadcastReceiver
{
    @Override
    public void onReceive(Context context, Intent intent)
    {
        new ReminderSyncerTask(context).execute();
    }
}
