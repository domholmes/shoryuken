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
	public final static String extra = "SmartReminder_Event_Extra";
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		String action = intent.getAction();
		Intent newIntent = null;
		
		if (action.equals(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION))
		{
			SupplicantState state = intent.getParcelableExtra(WifiManager.EXTRA_NEW_STATE);
			
			if(state == SupplicantState.COMPLETED)
			{
				WifiManager manager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);

				lastConnectedSsid = manager.getConnectionInfo().getSSID().replace("\"", "");
		
				
		        newIntent.setAction(Action.SmartReminder_Event_WifiConnected.name());
		        newIntent.putExtra(extra, lastConnectedSsid);
			}
			
			if(state == SupplicantState.DISCONNECTED)
			{
				boolean wifiEnabled = ((WifiManager)context.getSystemService(Context.WIFI_SERVICE)).isWifiEnabled();
				
				if(wifiEnabled)
				{	        
					newIntent.setAction(Action.SmartReminder_Event_WifiDisconnected.name());
					newIntent.putExtra(extra, lastConnectedSsid);	
				}
			}
		}
		
		if (intent.getAction().equals(Intent.ACTION_POWER_CONNECTED))
		{
			newIntent.setAction(Action.SmartReminder_Event_PowerConnected.name());
			newIntent.putExtra(extra, "");
		}
		
		context.sendBroadcast(newIntent);
	}
}
