package com.squirrel.auth;

import android.app.Activity;

public abstract class SignInHandlerSubscriber extends Activity
{
    abstract void onSignedInStateChanged(SignInState state);
}