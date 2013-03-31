package com.example.smartreminder;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;

import com.example.smartreminder.models.Reminder;

public class Notifier
{
	public void Notify(Context context, Reminder reminder)
	{
		Uri sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
		
		NotificationCompat.Builder mBuilder = 
				new NotificationCompat.Builder(context)
					.setSound(sound)
					.setSmallIcon(R.drawable.ic_launcher)
					.setContentText(reminder.notificationText)
					.setContentTitle("SmartReminder");

		PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
				new Intent(),
				PendingIntent.FLAG_UPDATE_CURRENT);
		
		mBuilder.setContentIntent(contentIntent);

		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		
		mNotificationManager.notify(1, mBuilder.build());
	}
}
