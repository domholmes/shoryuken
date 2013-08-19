package com.squirrel.domain;

import com.squirrel.action.Action;

import java.io.Serializable;
import java.util.List;

public class Reminder implements Serializable
{
    public int id;

    public Action action;

    public String actionExtra;
	
    public String extra;
    
	public String startTime;
	
	public String endTime;
	
	public List<Integer> days;
    
    public String notificationText;
}
