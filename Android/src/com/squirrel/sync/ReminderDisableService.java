package com.squirrel.sync;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;


public class ReminderDisableService extends Service
{
    @Override
    public int onStartCommand(Intent intent, int flags, int startId)
    {
        new ReminderDisableTask(this).execute(intent);

        return 0;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
