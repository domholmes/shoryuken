package com.squirrel.action;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.squirrel.domain.ReminderCheckerTask;

public class ActionReceiver extends BroadcastReceiver
{
	@Override
	public void onReceive(Context context, Intent intent)
	{
        new ReminderCheckerTask(context.getApplicationContext()).execute(intent);
	}
}