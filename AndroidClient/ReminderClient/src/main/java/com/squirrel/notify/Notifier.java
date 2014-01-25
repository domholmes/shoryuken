package com.squirrel.notify;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;

import com.squirrel.R;
import com.squirrel.sync.ReminderDisableService;

public class Notifier
{
	private Context context;

    public Notifier(Context context)
    {
        this.context = context;
    }

    public void Notify(String message, int reminderId, Boolean addDisableAction)
	{
		Notification notification = createNotification(message, reminderId, addDisableAction);

		NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		
		notificationManager.notify(reminderId, notification);
	}
	
	private Notification createNotification(String message, int reminderId, Boolean addDisableAction)
	{
        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(this.context)
                        .setAutoCancel(true)
                        .setOnlyAlertOnce(true)
                        .setSmallIcon(R.drawable.ic_launcher)
                        .setContentTitle("Squirrel")
                        .setContentText(message)
                        .setDefaults(Notification.DEFAULT_ALL)// requires VIBRATE permission
                        .setStyle(
                                new NotificationCompat
                                        .BigTextStyle()
                                        .bigText(message));

        if(addDisableAction)
        {
            addDisableAction(builder, reminderId);
        }

		return builder.build();
	}

    private void addDisableAction(NotificationCompat.Builder builder, int reminderId)
    {
        Intent disableIntent = new Intent(this.context, ReminderDisableService.class)
                .setAction("DISABLE")
                .setData(Uri.parse("id://" + reminderId));

        PendingIntent disablePendingIntent = PendingIntent.getService(this.context, 0, disableIntent, 0);


        builder.addAction(R.drawable.ic_launcher, "Disable", disablePendingIntent);
    }
}
