package com.squirrel.action;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.wifi.SupplicantState;
import android.net.wifi.WifiManager;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.LocationClient;
import com.squirrel.notify.Notifier;

import java.util.List;

public class IntentRemapperReceiver extends BroadcastReceiver
{
	public final static String extraName = "SmartReminder_Event_Extra";
    private final static int minutesBeforeRebroadcast = 2;
	
	@Override
	public void onReceive(Context context, Intent intent)
	{
        List<Geofence> geofences = LocationClient.getTriggeringGeofences(intent);

        if(geofences != null && !geofences.isEmpty())
        {
            Geofence triggeringGeofence = geofences.get(0);
            String reminderId = triggeringGeofence.getRequestId();
            broadcastIntent(Action.SmartReminder_Event_ById.name(), reminderId, context);
        }
        else
        {
            String action = intent.getAction();

            if (action.equals(WifiManager.NETWORK_STATE_CHANGED_ACTION))
            {
                WifiManager manager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);
                NetworkInfo networkInfo = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
                NetworkInfo.State state = networkInfo.getState();

                if(state == NetworkInfo.State.CONNECTED)
                {
                    String connectingToSsid = manager.getConnectionInfo().getSSID().replace("\"", "");
                    WifiStateHistory.recordConnectedSsid(connectingToSsid);

                    if(WifiStateHistory.notBroadcastInMinutes(connectingToSsid, minutesBeforeRebroadcast))
                    {
                        WifiStateHistory.recordBroadcastNow(connectingToSsid);
                        broadcastIntent(Action.SmartReminder_Event_WifiConnected.name(), connectingToSsid, context);
                    }
                }

                if(state == NetworkInfo.State.DISCONNECTED)
                {
                    if(manager.isWifiEnabled())
                    {
                        String disconnectedFromSsid = WifiStateHistory.getLastConnectedSsid();

                        if(WifiStateHistory.notBroadcastInMinutes(disconnectedFromSsid, minutesBeforeRebroadcast))
                        {
                            WifiStateHistory.recordBroadcastNow(disconnectedFromSsid);
                            broadcastIntent(Action.SmartReminder_Event_WifiDisconnected.name(), disconnectedFromSsid, context);
                        }
                    }
                }
            }

            if (action.equals(Intent.ACTION_POWER_CONNECTED))
            {
                broadcastIntent(Action.SmartReminder_Event_PowerConnected.name(), null, context);
            }

            if (action.equals(Intent.ACTION_POWER_DISCONNECTED))
            {
                broadcastIntent(Action.SmartReminder_Event_PowerDisconnected.name(), null, context);
            }
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
