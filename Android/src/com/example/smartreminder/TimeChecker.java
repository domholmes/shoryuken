package com.example.smartreminder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.example.smartreminder.models.Moment;

public class TimeChecker
{

	public boolean timeMatches(Moment moment) throws ParseException
	{
		SimpleDateFormat parser = new SimpleDateFormat("h:m");
		
		Calendar now = Calendar.getInstance();
		now.setTime(new Date());
		
		Calendar momentStart = Calendar.getInstance(); 
		momentStart.setTime(parser.parse(moment.startTime));
		momentStart.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentStart.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentStart.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		Calendar momentEnd = Calendar.getInstance(); 
		momentEnd.setTime(parser.parse(moment.endTime));
		momentEnd.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentEnd.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentEnd.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		if(moment.days.contains(now.get(Calendar.DAY_OF_WEEK)))
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
