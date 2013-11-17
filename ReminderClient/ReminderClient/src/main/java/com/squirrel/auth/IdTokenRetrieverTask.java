package com.squirrel.auth;

import com.google.android.gms.auth.GoogleAuthUtil;
import com.squirrel.util.AsyncResponse;

import android.content.Context;
import android.os.AsyncTask;

class IdTokenRetrieverTask extends AsyncTask<Void, Void, Boolean>
{
    private Context context;
    private String accountName;
    private IdTokenStore tokenStore;
    public AsyncResponse completionDelegate;

    public IdTokenRetrieverTask(Context context, String accountName, IdTokenStore tokenStore, AsyncResponse completionDelegate)
    {
        this.context = context;;
        this.accountName = accountName;
        this.tokenStore = tokenStore;
        this.completionDelegate = completionDelegate;
    }

    @Override
    protected Boolean doInBackground(Void... voids)
    {
        try
        {
            String idToken = GoogleAuthUtil.getToken(this.context, this.accountName, "audience:server:client_id:714250926431.apps.googleusercontent.com");

            this.tokenStore.putToken(idToken);

            return true;

        } catch (Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    @Override
    protected void onPostExecute (Boolean result)
    {
        this.completionDelegate.onTaskCompleted(result);
    }
}

