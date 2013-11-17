package com.squirrel.auth;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.plus.PlusClient;
import com.squirrel.R;
import com.squirrel.action.WifiStateHistory;
import com.squirrel.sync.ReminderRepository;
import com.squirrel.sync.ReminderSyncingScheduler;
import com.squirrel.util.AsyncResponse;

import java.io.IOException;

public class CredentialsActivity extends Activity implements View.OnClickListener, GooglePlayServicesClient.ConnectionCallbacks, GooglePlayServicesClient.OnConnectionFailedListener, AsyncResponse
{
    private static final int REQUEST_CODE_RESOLVE_ERR = 9000;
    private ProgressDialog progressDialog;
    private PlusClient plusClient;
    private IdTokenStore tokenStore;
    private ReminderRepository reminderStore;
    private SignInButton signInButton;
    private Boolean isSignedIn;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.tokenStore = new IdTokenStore(getApplicationContext());
        this.reminderStore = new ReminderRepository(getApplicationContext());

        this.signInButton = (SignInButton)findViewById(R.id.sign_in_button);
        this.signInButton.setOnClickListener(this);
        this.signInButton.setSize(SignInButton.SIZE_WIDE);
        plusClient = new PlusClient.Builder(this, this, this)
                .setVisibleActivities("http://schemas.google.com/AddActivity", "http://schemas.google.com/BuyActivity")
                .build();

        progressDialog = new ProgressDialog(this);

        updateSignedInState();
    }

    @Override
    public void onConnected(Bundle bundle)
    {
        new IdTokenRetrieverTask(this, this.plusClient.getAccountName(), this.tokenStore, this).execute();
    }

    @Override
    public void onConnectionFailed(ConnectionResult result)
    {
        if (result.hasResolution())
        {
            try
            {
                result.startResolutionForResult(this, REQUEST_CODE_RESOLVE_ERR);
            }
            catch (IntentSender.SendIntentException e)
            {
                plusClient.connect();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int responseCode, Intent intent)
    {
        if (requestCode == REQUEST_CODE_RESOLVE_ERR && responseCode == RESULT_OK)
        {
            plusClient.connect();
        }
    }

    @Override
    public void onDisconnected()
    {
    }

    @Override
    protected void onStop()
    {
        super.onStop();
        this.plusClient.disconnect();
    }

    @Override
    public void onClick(View view)
    {
        if (!this.isSignedIn)
        {
            progressDialog.setMessage("Signing in...");
            progressDialog.show();
            plusClient.connect();
        }
        else
        {
            if(plusClient.isConnected())
            {
                plusClient.clearDefaultAccount();
                plusClient.disconnect();
            }

            this.tokenStore.removeToken();
            Toast.makeText(this, "Signed out, your device will no long receive reminders", Toast.LENGTH_LONG).show();

            updateSignedInState();

            try
            {
                this.reminderStore.clearReminders();
            }
            catch (IOException e)
            {
                Log.e("", "Unable to clear reminders", e);
            }
        }
    }

    @Override
    public void onTaskCompleted(Boolean result)
    {
        if(result)
        {
            updateSignedInState();

            Toast.makeText(this, "Signed in, your device will now receive reminders", Toast.LENGTH_LONG).show();

            WifiStateHistory.updateState(this);
            ReminderSyncingScheduler.scheduleReminderSyncing(this);
        }
        else
        {
            Toast.makeText(this, "There was a problem signing in", Toast.LENGTH_LONG).show();
        }
    }

    private void updateSignedInState()
    {
        this.progressDialog.dismiss();
        this.isSignedIn = this.tokenStore.hasToken();

        if(this.isSignedIn)
        {
            setGooglePlusButtonText("Sign out");
        }
        else
        {
            setGooglePlusButtonText("Sign in");
        }
    }

    protected void setGooglePlusButtonText(String buttonText)
    {
        for (int i = 0; i < this.signInButton.getChildCount(); i++) {
            View v = this.signInButton.getChildAt(i);

            if (v instanceof TextView) {
                TextView tv = (TextView) v;
                tv.setText(buttonText);
                return;
            }
        }
    }
}