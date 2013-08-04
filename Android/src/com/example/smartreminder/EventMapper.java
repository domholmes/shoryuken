package com.example.smartreminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiManager;

import java.util.Date;

public class EventMapper extends BroadcastReceiver
{
	public final static String extraName = "SmartReminder_Event_Extra";
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
		String action = intent.getAction();
		
		if (action.equals(WifiManager.SUPPLICANT_STATE_CHANGED_ACTION))
		{
            WifiManager manager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);
            SupplicantState state = intent.getParcelableExtra(WifiManager.EXTRA_NEW_STATE);
			
			if(state == SupplicantState.COMPLETED)
			{
                WifiHistory.lastKnownSsid = manager.getConnectionInfo().getSSID().replace("\"", "");

                if(notBroadcastInLast2Mins())
                {
                    WifiHistory.lastBroadcast = new Date();
                    broadcastIntent(Action.SmartReminder_Event_WifiConnected.name(), WifiHistory.lastKnownSsid, context);
                }
			}
			
			if(state == SupplicantState.DISCONNECTED)
			{
				if(manager.isWifiEnabled())
				{
                    if(notBroadcastInLast2Mins())
                    {
                        WifiHistory.lastBroadcast = new Date();
                        broadcastIntent(Action.SmartReminder_Event_WifiDisconnected.name(), WifiHistory.lastKnownSsid, context);
                    }
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

    private boolean notBroadcastInLast2Mins()
    {
        if(WifiHistory.lastBroadcast != null)
        {
            long timeSince = (new Date()).getTime() - WifiHistory.lastBroadcast.getTime();

            if(timeSince < 120000)
            {
                return false;
            }
        }

        return true;
    }

    private void broadcastIntent(String action, String extra, Context context)
	{
		Intent newIntent = new Intent();
		
		newIntent.setAction(action);
        newIntent.putExtra(extraName, extra);
        
        context.sendBroadcast(newIntent);
	}
}
