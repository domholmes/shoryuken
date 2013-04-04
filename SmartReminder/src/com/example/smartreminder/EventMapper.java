package com.example.smartreminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiManager;
import android.util.Log;

public class EventMapper extends BroadcastReceiver
{
	private static String lastConnectedSsid = "";
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		if (intent.getAction().equals(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION))
		{
			SupplicantState state = intent.getParcelableExtra(WifiManager.EXTRA_NEW_STATE);
			
			if(state == SupplicantState.COMPLETED)
			{
				WifiManager manager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);

				lastConnectedSsid = manager.getConnectionInfo().getSSID().replace("\"", "");
				
				Intent newIntent = new Intent();	        
		        newIntent.setAction(Event.SmartReminder_Event_WifiConnected.name());
		        newIntent.putExtra("SmartReminder_Events_SSID", lastConnectedSsid);
		        
		    	context.sendBroadcast(newIntent);
			}
			
			if(state == SupplicantState.DISCONNECTED)
			{
				boolean wifiEnabled = ((WifiManager)context.getSystemService(Context.WIFI_SERVICE)).isWifiEnabled();
				
				if(wifiEnabled)
				{
					Intent newIntent = new Intent();	        
					newIntent.setAction(Event.SmartReminder_Event_WifiDisconnected.name());
					newIntent.putExtra("SmartReminder_Events_SSID", lastConnectedSsid);
		        
					context.sendBroadcast(newIntent);	
				}
			}
		}
	}
}
