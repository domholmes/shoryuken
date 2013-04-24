package com.example.smartreminder.models;

import java.util.Date;
import java.util.List;

import com.example.smartreminder.Action;

public class Moment
{
	public String name;
 
	public Action action;
	
	public String extra;
	
	public String startTime;
	
	public String endTime;
	
	public Date specificDate;
	
	public List<Integer> days;
}
