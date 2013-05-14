package com.example.smartreminder;

import android.app.Notification;
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
	public void Notify(Context context, String message)
	{
		Notification notification = createNotification(context, message);

		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		
		mNotificationManager.notify(1, notification);
	}
	
	private Notification createNotification(Context context, String message)
	{
		Uri sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
		
		NotificationCompat.Builder mBuilder = 
				new NotificationCompat.Builder(context)
					.setSound(sound)
					.setSmallIcon(R.drawable.ic_launcher)
					.setContentText(message)
					.setContentTitle("SmartReminder");

		PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
				new Intent(),
				PendingIntent.FLAG_UPDATE_CURRENT);
		
		mBuilder.setContentIntent(contentIntent);
		
		return mBuilder.build();
	}
}
