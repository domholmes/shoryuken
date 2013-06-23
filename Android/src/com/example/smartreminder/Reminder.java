package com.example.smartreminder;

import java.util.List;

import com.example.smartreminder.Action;

public class Reminder
{
    public int id;

    public Action action;
	
    public String extra;
    
	public String startTime;
	
	public String endTime;
	
	public List<Integer> days;
    
    public String notificationText;
}
