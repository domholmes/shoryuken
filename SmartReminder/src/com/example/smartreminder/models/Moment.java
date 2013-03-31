package com.example.smartreminder.models;

import java.util.Date;
import java.util.List;

import com.example.smartreminder.EventIds;

public class Moment
{
	public String name;
 
	public EventIds eventTypeId;
	
	public String ssid;
	
	public String startTime;
	
	public String endTime;
	
	public Date specificDate;
	
	public List<Integer> days;
}
