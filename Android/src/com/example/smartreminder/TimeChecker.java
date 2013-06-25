package com.example.smartreminder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TimeChecker
{
	private SimpleDateFormat parser = new SimpleDateFormat("H:m");
	
	public boolean timeMatches(Reminder reminder) throws ParseException
	{
		Calendar now = Calendar.getInstance();
		now.setTime(new Date());
		
		Calendar momentStart = getMomentDateTime(reminder.startTime, now);
		Calendar momentEnd = getMomentDateTime(reminder.endTime, now);
		
		if(reminder.days.contains(now.get(Calendar.DAY_OF_WEEK)))
		{
			if(nowIsWithinMoments(momentStart, momentEnd, now))
			{
				return true;
			}
		}
		
		return false;
	}

	private boolean nowIsWithinMoments(Calendar momentStart, Calendar momentEnd, Calendar now)
	{
		long start = momentStart.getTimeInMillis();
		long end = momentEnd.getTimeInMillis();
		long nowM = now.getTimeInMillis();
		
		if(start <= nowM && end >= nowM)
		{
			return true;
		}
		
		return false;
	}

	private Calendar getMomentDateTime(String time, Calendar now) throws ParseException
	{
		Calendar momentStart = Calendar.getInstance(); 

		momentStart.setTime(parser.parse(time));
		
		momentStart.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentStart.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentStart.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		return momentStart;
	}
}
