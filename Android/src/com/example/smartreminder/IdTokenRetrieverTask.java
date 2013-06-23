package com.example.smartreminder;

import java.io.IOException;

import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;

import android.content.Context;
import android.os.AsyncTask;

class IdTokenRetrieverTask extends AsyncTask<Void, Void, Void>
{
    private Context context;
    private String accountName;
    private IdTokenStore tokenStore;

    public IdTokenRetrieverTask(Context context, String accountName, IdTokenStore tokenStore)
    {
        this.context = context;;
        this.accountName = accountName;
        this.tokenStore = tokenStore;
    }

    @Override
    protected Void doInBackground(Void... voids)
    {
        String idToken;

        try {
            idToken = GoogleAuthUtil.getToken(this.context, this.accountName, "audience:server:client_id:714250926431.apps.googleusercontent.com");

            this.tokenStore.putToken(idToken);

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

