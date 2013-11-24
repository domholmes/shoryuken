package com.squirrel.auth;

import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.plus.PlusClient;
import com.squirrel.util.AsyncResponse;

public class SignInHandler implements GooglePlayServicesClient.ConnectionCallbacks, GooglePlayServicesClient.OnConnectionFailedListener, AsyncResponse
{
    public static final int REQUEST_CODE_RESOLVE_ERR = 9000;

    private PlusClient plusClient;
    private IdTokenStore tokenStore;
    private Context context;
    SignInActivity callingActivity;

    public SignInHandler(Context context, SignInActivity callingActivity)
    {
        this.context = context;
        this.callingActivity = callingActivity;
        this.tokenStore = new IdTokenStore(context);

        plusClient = new PlusClient.Builder(context, this, this)
                .setVisibleActivities("http://schemas.google.com/AddActivity", "http://schemas.google.com/BuyActivity")
                .build();

    }

    @Override
    public void onDisconnected()
    {

    }

    @Override
    public void onConnectionFailed(ConnectionResult result)
    {
        if (result.hasResolution())
        {
            try
            {
                result.startResolutionForResult(this.callingActivity, REQUEST_CODE_RESOLVE_ERR);
            }
            catch (IntentSender.SendIntentException e)
            {
                plusClient.connect();
            }
        }
    }

    @Override
    public void onConnected(Bundle bundle)
    {
        new IdTokenRetrieverTask(this.context, this.plusClient.getAccountName(), this.tokenStore, this).execute();
    }

    @Override
    public void onTaskCompleted(Boolean tokenRetrievalWasSuccessful)
    {
        if(tokenRetrievalWasSuccessful)
        {
            this.callingActivity.onSignedInStateChanged(SignInState.SignedIn);
        }
        else
        {
            this.callingActivity.onSignedInStateChanged(SignInState.Errored);
        }
    }

    public void changeState()
    {
        if(isSignedIn())
        {
            if(this.plusClient.isConnected())
            {
                this.plusClient.clearDefaultAccount();
                this.plusClient.disconnect();
            }

            this.tokenStore.removeToken();

            this.callingActivity.onSignedInStateChanged(SignInState.SignedOut);
        }
        else
        {
            this.plusClient.connect();
        }
    }

    public Boolean isSignedIn()
    {
        return this.tokenStore.hasToken();
    }
}
