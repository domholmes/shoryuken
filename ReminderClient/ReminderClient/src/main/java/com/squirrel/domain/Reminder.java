package com.squirrel.domain;

import android.content.Intent;

import com.squirrel.action.Action;
import com.squirrel.action.ReminderIntentMatcher;

import java.io.Serializable;
import java.text.ParseException;
import java.util.List;

public class Reminder implements Serializable
{
    public int id;

    public Action action;

    public String ssid;

    public String latLong;

	public String startTime;
	
	public String endTime;
	
	public List<Integer> days;
    
    public String notificationText;

    public boolean enabled;

    public boolean repeat;

    public boolean postActivity;

    public Boolean shouldNotify(Intent intent) throws ParseException
    {
        if(this.enabled)
        {
            if(ReminderIntentMatcher.isMatch(this, intent) && ReminderTimeMatcher.isMatch(this))
            {
                return true;
            }
        }

        return false;
    }
}
