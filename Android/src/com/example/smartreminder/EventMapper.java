package com.example.smartreminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiManager;

public class EventMapper extends BroadcastReceiver
{
	private static String lastConnectedSsid = "";
	public final static String extraName = "SmartReminder_Event_Extra";
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		String action = intent.getAction();
		
		if (action.equals(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION))
		{
			SupplicantState state = intent.getParcelableExtra(WifiManager.EXTRA_NEW_STATE);
			
			if(state == SupplicantState.COMPLETED)
			{
				WifiManager manager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);

				lastConnectedSsid = manager.getConnectionInfo().getSSID().replace("\"", "");
					
		        broadcastIntent(Action.SmartReminder_Event_WifiConnected.name(), lastConnectedSsid, context);
			}
			
			if(state == SupplicantState.DISCONNECTED)
			{
				boolean wifiEnabled = ((WifiManager)context.getSystemService(Context.WIFI_SERVICE)).isWifiEnabled();
				
				if(wifiEnabled)
				{	        
					broadcastIntent(Action.SmartReminder_Event_WifiDisconnected.name(), lastConnectedSsid, context);
				}
			}
		}
		
		if (intent.getAction().equals(Intent.ACTION_POWER_CONNECTED))
		{
			broadcastIntent(Action.SmartReminder_Event_PowerConnected.name(), "", context);
		}
		
		if (intent.getAction().equals(Intent.ACTION_POWER_DISCONNECTED))
		{
			broadcastIntent(Action.SmartReminder_Event_PowerDisconnected.name(), "", context);
		}
	}
	
	private void broadcastIntent(String action, String extra, Context context)
	{
		Intent newIntent = new Intent();
		
		newIntent.setAction(action);
        newIntent.putExtra(extraName, extra);
        
        context.sendBroadcast(newIntent);
	}
}
