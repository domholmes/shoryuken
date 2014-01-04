package com.squirrel.auth;

import android.content.Context;
import android.content.SharedPreferences;

public class IdTokenStore {

    private final String tokenName = "idToken";
    private SharedPreferences sharedPreferences;


    public IdTokenStore(Context context)
    {
        this.sharedPreferences = context.getSharedPreferences("auth", Context.MODE_MULTI_PROCESS);
    }

    public String getToken()
    {
        return sharedPreferences.getString(tokenName, null);
    }

    public void putToken(String token)
    {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putString(tokenName, token);

        editor.commit();
    }

    public void removeToken()
    {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putString(tokenName, null);

        editor.commit();
    }

    public Boolean hasToken()
    {
        return (getToken() != null);
    }
}
