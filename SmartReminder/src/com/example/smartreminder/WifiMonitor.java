package com.example.smartreminder;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

public class WifiMonitor extends BroadcastReceiver 
{
    private String TAG = "TGtracker";

    @Override
    public void onReceive(Context context, Intent intent) 
    {
    	NotificationCompat.Builder mBuilder =
    	        new NotificationCompat.Builder(context)
    	        .setSmallIcon(R.drawable.ic_launcher)
    	        .setContentTitle("My notification");


    	PendingIntent contentIntent = PendingIntent.getActivity(
    		    context,
    		    0,
    		    new Intent(), // add this
    		    PendingIntent.FLAG_UPDATE_CURRENT);
    	
    	mBuilder.setContentIntent(contentIntent);
    	
    	NotificationManager mNotificationManager =
    	    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

    	
    	
        WifiManager wifi = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        
        if (wifi.isWifiEnabled()==true) 
        {
        	mBuilder = mBuilder.setContentText("You are connected to WIFI "+wifi.getConnectionInfo());
        } 
        else 
        {
        	mBuilder = mBuilder.setContentText("You are not connected to WIFI");
        }

    	mNotificationManager.notify(1, mBuilder.build());
    }
}