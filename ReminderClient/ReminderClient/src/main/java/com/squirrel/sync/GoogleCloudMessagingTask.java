package com.squirrel.sync;

import android.content.Context;
import android.os.AsyncTask;

import com.google.android.gms.gcm.GoogleCloudMessaging;

import java.io.IOException;

public class GoogleCloudMessagingTask extends AsyncTask<Void, Void, String>
{
    private Context context;
    private final String SENDER_ID = "Your-Sender-ID";

    public GoogleCloudMessagingTask(Context context)
    {
        this.context = context;
    }

    @Override
    protected String doInBackground(Void... params) {
        String msg = "";
        try
        {
            GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(context);
            String regid = gcm.register(SENDER_ID);

            // You should send the registration ID to your server over HTTP, so it
        }
        catch (IOException ex)
        {
            msg = "Error :" + ex.getMessage();
            // If there is an error, don't just keep trying to register.
        }
        return msg;
    }
}
