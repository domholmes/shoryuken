package com.squirrel.auth;

import android.content.Context;
import android.os.Bundle;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.plus.PlusClient;
import com.google.android.gms.plus.model.moments.ItemScope;
import com.google.android.gms.plus.model.moments.Moment;
import com.squirrel.domain.Reminder;

import java.util.ArrayList;
import java.util.List;

public class ActivityPoster implements GooglePlayServicesClient.ConnectionCallbacks, GooglePlayServicesClient.OnConnectionFailedListener
{
    private PlusClient plusClient;
    private List<Moment> activities;

    public ActivityPoster(Context context)
    {
        this.plusClient = new PlusClient.Builder(context, this, this)
                //.setVisibleActivities("http://schemas.google.com/CheckInActivity", "http://schemas.google.com/ListenActivity")
                //.setScopes("https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email")
                .build();

        this.activities = new ArrayList<Moment>();
    }

    public void addNewCheckIn(Reminder reminder)
    {
        addNewCheckInToActivityList(reminder);

        if(this.plusClient.isConnected())
        {
           postCheckIns();
        }
        else
        {
            this.plusClient.connect();
        }
    }

    private void addNewCheckInToActivityList(Reminder reminder)
    {
        ItemScope address = new ItemScope.Builder()
                .setName("Centre")
                .setType("http://schema.org/Address")
                .setStreetAddress("Road")
                .setAddressRegion("UK")
                .setAddressRegion("GB")
                .build();

        ItemScope target = new ItemScope.Builder()
                .setName("Coffeeshop")
                .setType("http://schema.org/Place")
                .setAddress(address)
                .build();

        Moment moment = new Moment.Builder()
                .setType("http://schemas.google.com/CheckInActivity")
                .setTarget(target)
                .build();

        this.activities.add(moment);
    }

    private void postCheckIns()
    {
        for(Moment moment : this.activities)
        {
            this.plusClient.writeMoment(moment);
        }
    }

    @Override
    public void onConnected(Bundle bundle)
    {
        postCheckIns();
    }

    @Override
    public void onDisconnected()
    {

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult)
    {

    }
}
