package com.example.smartreminder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.example.smartreminder.models.Reminder;

public class TimeChecker
{

	public boolean timeMatches(Reminder reminder)
	{
		SimpleDateFormat parser = new SimpleDateFormat("H:m");
		
		Calendar now = Calendar.getInstance();
		now.setTime(new Date());
		
		Calendar momentStart = Calendar.getInstance(); 
		try
		{
			momentStart.setTime(parser.parse(reminder.startTime));
		} 
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		momentStart.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentStart.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentStart.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		Calendar momentEnd = Calendar.getInstance(); 
		try
		{
			momentEnd.setTime(parser.parse(reminder.endTime));
		} 
		catch (ParseException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		momentEnd.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentEnd.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentEnd.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		if(reminder.days.contains(now.get(Calendar.DAY_OF_WEEK)))
		{
			long start = momentStart.getTimeInMillis();
			long end = momentEnd.getTimeInMillis();
			long nowM = now.getTimeInMillis();
			
			if(start <= nowM && end >= nowM)
			{
				return true;
			}
		}
		
		return false;
	}

}
