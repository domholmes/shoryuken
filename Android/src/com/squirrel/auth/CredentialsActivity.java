package com.squirrel.auth;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.plus.PlusClient;
import com.squirrel.R;
import com.squirrel.sync.ReminderSyncingScheduler;
import com.squirrel.action.WifiStateHistory;

public class CredentialsActivity extends Activity implements View.OnClickListener, GooglePlayServicesClient.ConnectionCallbacks, GooglePlayServicesClient.OnConnectionFailedListener
{
    private static final String TAG = "ExampleActivity";
    private static final int REQUEST_CODE_RESOLVE_ERR = 9000;

    private ProgressDialog progressDialog;
    private PlusClient plusClient;
    private ConnectionResult connectionResult;
    private IdTokenStore tokenStore;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_credentials);
        findViewById(R.id.sign_in_button).setOnClickListener(this);

        this.tokenStore = new IdTokenStore(getApplicationContext());

        plusClient = new PlusClient.Builder(this, this, this)
                .setVisibleActivities("http://schemas.google.com/AddActivity", "http://schemas.google.com/BuyActivity")
                .build();

        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Signing in...");
    }

    @Override
    protected void onStart()
    {
        super.onStart();
        plusClient.connect();
    }

    @Override
    protected void onStop()
    {
        super.onStop();
        plusClient.disconnect();
    }

    @Override
    public void onConnectionFailed(ConnectionResult result)
    {
        if (result.hasResolution())
        {
            try
            {
                result.startResolutionForResult(this, REQUEST_CODE_RESOLVE_ERR);
            } catch (IntentSender.SendIntentException e)
            {
                plusClient.connect();
            }
        }

        connectionResult = result;
    }

    @Override
    protected void onActivityResult(int requestCode, int responseCode, Intent intent)
    {
        if (requestCode == REQUEST_CODE_RESOLVE_ERR && responseCode == RESULT_OK)
        {
            connectionResult = null;
            plusClient.connect();
        }
    }

    @Override
    public void onConnected(Bundle bundle)
    {
        String accountName = plusClient.getAccountName();

        new IdTokenRetrieverTask(this, accountName, this.tokenStore).execute(null);

        Toast.makeText(this, accountName + " is connected", Toast.LENGTH_LONG).show();

        WifiStateHistory.updateState(this);
        ReminderSyncingScheduler.scheduleReminderSyncing(this);
    }

    @Override
    public void onDisconnected()
    {
        Log.d(TAG, "disconnected");
    }

    @Override
    public void onClick(View view)
    {

        if (!plusClient.isConnected())
        {
            if (connectionResult == null)
            {
                progressDialog.show();
            } else
            {
                try
                {
                    connectionResult.startResolutionForResult(this, REQUEST_CODE_RESOLVE_ERR);
                } catch (IntentSender.SendIntentException e)
                {
                    // Try connecting again.
                    connectionResult = null;
                    plusClient.connect();
                }
            }
        }
        else
        {
            findViewById(R.id.sign_in_button).setVisibility(View.VISIBLE);
            plusClient.clearDefaultAccount();
            plusClient.disconnect();

            this.tokenStore.removeToken();

            plusClient.connect();
        }
    }
}