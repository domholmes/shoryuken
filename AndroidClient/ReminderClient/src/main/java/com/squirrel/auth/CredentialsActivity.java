package com.squirrel.auth;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.SignInButton;
import com.squirrel.R;
import com.squirrel.action.WifiStateHistory;
import com.squirrel.sync.ReminderRepository;
import com.squirrel.sync.ReminderSyncingScheduler;

public class CredentialsActivity extends SignInActivity implements View.OnClickListener
{
    private ProgressDialog progressDialog;
    private ReminderRepository reminderStore;
    private SignInButton signInButton;
    private SignInHandler signInHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.signInHandler = new SignInHandler(getApplicationContext(), this);
        this.reminderStore = new ReminderRepository(getApplicationContext());

        this.signInButton = (SignInButton)findViewById(R.id.sign_in_button);
        this.signInButton.setOnClickListener(this);
        this.signInButton.setSize(SignInButton.SIZE_WIDE);
        setGooglePlusButtonText();

        progressDialog = new ProgressDialog(this);
    }

    @Override
    public void onClick(View view)
    {
        this.signInHandler.changeState();
    }

    @Override
    public void onSignedInStateChanged(SignInState state)
    {
        this.progressDialog.dismiss();
        setGooglePlusButtonText();

        switch (state)
        {
            case SignedIn:

                Toast.makeText(this, "Signed in, your device will now receive reminders", Toast.LENGTH_LONG).show();
                WifiStateHistory.updateState(this);
                ReminderSyncingScheduler.scheduleReminderSyncing(this);
                break;

            case SignedOut:

                Toast.makeText(this, "Signed out, your device will no longer receive reminders", Toast.LENGTH_LONG).show();
                break;

            default:

                Toast.makeText(this, "There was a problem signing in, please ensure you have a connection to the Internet and try again", Toast.LENGTH_LONG).show();
                break;
        }
    }

    @Override
    public void onSignedInStateChanging(SignInState state)
    {
        String message = state == SignInState.SignedIn ? "Signing in" : "Signing out";

        this.progressDialog.setMessage(message);
        this.progressDialog.show();
    }

    protected void setGooglePlusButtonText()
    {
        String buttonText = this.signInHandler.isSignedIn() ? "Sign out" : "Sign in";

        for (int i = 0; i < this.signInButton.getChildCount(); i++) {
            View v = this.signInButton.getChildAt(i);

            if (v instanceof TextView) {
                TextView tv = (TextView) v;
                tv.setText(buttonText);
                return;
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int responseCode, Intent intent)
    {
        if (requestCode == SignInHandler.REQUEST_CODE_RESOLVE_ERR && responseCode == RESULT_OK)
        {
            this.signInHandler.changeState();
        }
    }
}