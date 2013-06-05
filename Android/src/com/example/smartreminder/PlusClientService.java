package com.example.smartreminder;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.gms.common.*;
import com.google.android.gms.common.GooglePlayServicesClient.*;
import com.google.android.gms.plus.PlusClient;

public class PlusClientService implements ConnectionCallbacks, OnConnectionFailedListener {

    private Context context;
    private PlusClient mPlusClient;

    public PlusClientService(Context context)
    {
        this.context = context;

        mPlusClient = new PlusClient.Builder(context, this, this)
                .setVisibleActivities("http://schemas.google.com/AddActivity", "http://schemas.google.com/BuyActivity")
                .build();

        mPlusClient.connect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        Toast.makeText(context, "connection failed", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onConnected(Bundle bundle) {
        String accountName = mPlusClient.getAccountName();
        Toast.makeText(context, accountName + " is connected.", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onDisconnected() {
        Toast.makeText(context, "disconnected", Toast.LENGTH_LONG).show();
    }
}