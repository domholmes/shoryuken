package com.example.smartreminder;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import org.json.JSONException;

import com.example.smartreminder.models.Reminder;
import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;

class IdTokenRetrieverTask extends AsyncTask<Void, Void, Void>
{
    private Context context;
    private SharedPreferences persistentStore;
    private String accountName;

    public IdTokenRetrieverTask(Context context, SharedPreferences persistentStore, String accountName)
    {
        this.context = context;
        this.persistentStore = persistentStore;
        this.accountName = accountName;
    }

    @Override
    protected Void doInBackground(Void... voids)
    {
        String idToken;

        try {
            idToken = GoogleAuthUtil.getToken(this.context, this.accountName, "audience:server:client_id:714250926431.apps.googleusercontent.com");

            SharedPreferences.Editor editor = persistentStore.edit();
            editor.putString("idToken", idToken);

            editor.commit();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (GoogleAuthException e) {
            e.printStackTrace();
        }

        return null;
    }

    protected void onProgressUpdate() {
    }

    protected void onPostExecute() {
    }
}

