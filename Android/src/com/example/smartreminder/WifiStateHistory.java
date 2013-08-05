package com.example.smartreminder;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class WifiStateHistory
{
    public static String lastConnectedSsid = null;
    private static Date lastBroadcast = null;

    public static void updateState(Context context)
    {
        ConnectivityManager connManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);

        if(networkInfo.isConnected())
        {
            WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
            lastConnectedSsid = wifiManager.getConnectionInfo().getSSID().replace("\"", "");
        }
    }

    public static boolean notBroadcastInMinutes(long minutes)
    {
        if(lastBroadcast != null)
        {
            long timeSince = (new Date()).getTime() - lastBroadcast.getTime();

            if(timeSince < TimeUnit.MINUTES.toMillis(minutes))
            {
                return false;
            }
        }

        return true;
    }

    public static void recordBroadcastNow()
    {
        lastBroadcast = new Date();
    }
}
