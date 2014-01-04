package com.squirrel.domain;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class ReminderTimeMatcher
{
	private static final SimpleDateFormat parser = new SimpleDateFormat("H:m");
	
	public static boolean isMatch(Reminder reminder) throws ParseException
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

	private static boolean nowIsWithinMoments(Calendar momentStart, Calendar momentEnd, Calendar now)
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

	private static Calendar getMomentDateTime(String time, Calendar now) throws ParseException
	{
		Calendar momentStart = Calendar.getInstance(); 

		momentStart.setTime(parser.parse(time));
		
		momentStart.set(Calendar.YEAR, now.get(Calendar.YEAR));
		momentStart.set(Calendar.MONTH, now.get(Calendar.MONTH));
		momentStart.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		
		return momentStart;
	}
}
