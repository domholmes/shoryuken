package com.squirrel.auth;

import android.app.Activity;

public abstract class SignInActivity extends Activity
{
    abstract void onSignedInStateChanged(SignInState state);

    abstract void onSignedInStateChanging(SignInState state);
}