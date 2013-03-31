package com.example.smartreminder;

import com.example.smartreminder.models.Moment;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;

public class EventChecker
{
	public Boolean eventMatches(Context context, Intent intent, Moment moment)
	{
		String action = intent.getAction();
		
		if(action == WifiActioner.WIFI_CONNECTED_ACTION && moment.eventTypeId == EventIds.WifiConnected)
		{
			String ssid = intent.getStringExtra("SmartReminder_Events_SSID");
			
			if(moment.ssid.equalsIgnoreCase(ssid))
			{
				return true;
			}
		}
		
		if(action == WifiActioner.WIFI_DISCONNECTED_ACTION && moment.eventTypeId == EventIds.WifiDisconnected)
		{
			return true;
		}
		
		return false;
	}
}
