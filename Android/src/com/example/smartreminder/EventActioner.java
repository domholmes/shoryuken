package com.example.smartreminder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.example.smartreminder.models.Reminder;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

public class EventActioner extends BroadcastReceiver
{
	@Override
	public void onReceive(Context context, Intent intent)
	{
		new DownloadFilesTask(context).execute(intent);
		
		//context.startService(new Intent(context, ReminderService.class));
	}
}