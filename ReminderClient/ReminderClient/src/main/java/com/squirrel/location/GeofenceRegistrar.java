package com.squirrel.location;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationStatusCodes;
import com.squirrel.action.IntentRemapperReceiver;
import com.squirrel.domain.ReminderCheckerTask;

import java.util.ArrayList;
import java.util.Date;

public class GeofenceRegistrar implements
        GooglePlayServicesClient.ConnectionCallbacks,
        GooglePlayServicesClient.OnConnectionFailedListener,
        LocationClient.OnAddGeofencesResultListener,
        LocationClient.OnRemoveGeofencesResultListener
{
    private Context context;
    private LocationClient locationClient;
    private ArrayList<Geofence> geofencesToAdd;
    private PendingIntent pendingIntent;

    public GeofenceRegistrar(Context context)
    {
        this.context = context;
        this.locationClient = new LocationClient(context, this, this);

        pendingIntent = PendingIntent.getBroadcast(
                this.context,
                0,
                new Intent(this.context, IntentRemapperReceiver.class),
                PendingIntent.FLAG_CANCEL_CURRENT);
    }

    public void registerGeofences(ArrayList<Geofence> geofences)
    {
        this.geofencesToAdd = geofences;
        this.locationClient.connect();
    }

    @Override
    public void onConnected(Bundle bundle)
    {
        locationClient.removeGeofences(pendingIntent, this);
    }

    @Override
    public void onDisconnected()
    {

    }

    @Override
    public void onAddGeofencesResult(int i, String[] strings)
    {
        if(i == LocationStatusCodes.SUCCESS)
        {
            this.geofencesToAdd = null;
        }
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult)
    {

    }

    @Override
    public void onRemoveGeofencesByRequestIdsResult(int i, String[] strings)
    {

    }

    @Override
    public void onRemoveGeofencesByPendingIntentResult(int i, PendingIntent pendingIntent)
    {
        locationClient.addGeofences(this.geofencesToAdd, pendingIntent, this);

        /*locationClient.setMockMode(true);
        Location mock = new Location("mock");
        mock.setLongitude(50.733009);
        mock.setLatitude(-3.56229);
        mock.setTime(System.currentTimeMillis()-500000);
        locationClient.setMockLocation(mock);*/
        Location l = locationClient.getLastLocation();
    }
}
