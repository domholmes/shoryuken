package com.example.smartreminder;

import java.io.Serializable;
import java.util.List;

import com.example.smartreminder.Action;

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
