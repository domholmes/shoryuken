package com.squirrel.domain;

import com.squirrel.action.Action;

import java.io.Serializable;
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
}
