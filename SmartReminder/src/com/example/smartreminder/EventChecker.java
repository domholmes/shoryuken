package com.example.smartreminder;

import com.example.smartreminder.models.Moment;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Bundle;

public class EventChecker
{

	public Boolean eventMatches(Context context, Intent intent, Moment moment)
	{
		WifiManager wifi = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);

		if ((wifi.isWifiEnabled() == true) && (moment.eventTypeId == EventIds.WifiConnected))
		{
			return true;
		} 
		
		if ((wifi.isWifiEnabled() == false) && (moment.eventTypeId == EventIds.WifiDisconnected))
		{
			return true;
		} 
		
		return false;
	}
}
