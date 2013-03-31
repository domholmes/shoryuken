package com.example.smartreminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

public class WifiActioner extends BroadcastReceiver
{
	public final static String WIFI_CONNECTED_ACTION = "SmartReminder_Event_WifiConnected";
	public final static String WIFI_DISCONNECTED_ACTION = "SmartReminder_Event_WifiDisconnected";
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		if(intent.getAction().equals(WifiManager.NETWORK_STATE_CHANGED_ACTION)) 
		{
		    NetworkInfo networkInfo = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
		    
		    if(networkInfo.isConnected()) 
		    {
		        Intent newIntent = new Intent();	        
		        newIntent.setAction(WIFI_CONNECTED_ACTION);
		        newIntent.putExtra("SmartReminder_Events_SSID", networkInfo.getExtraInfo().replace("\"", ""));
		        
		    	context.sendBroadcast(newIntent);
		    }
		} 
		else if(intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) 
		{
		    NetworkInfo networkInfo = intent.getParcelableExtra(ConnectivityManager.EXTRA_NETWORK_INFO);
		    
		    if(networkInfo.getType() == ConnectivityManager.TYPE_WIFI && !networkInfo.isConnected()) 
		    {
		    	Intent newIntent = new Intent();	        
		        newIntent.setAction(WIFI_DISCONNECTED_ACTION);
		        
		    	context.sendBroadcast(newIntent);
		    }
		}
	}

}
