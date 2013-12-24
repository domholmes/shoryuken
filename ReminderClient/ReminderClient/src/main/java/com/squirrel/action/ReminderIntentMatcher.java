package com.squirrel.action;

import android.content.Intent;
import android.text.TextUtils;

import com.squirrel.domain.Reminder;

public class ReminderIntentMatcher
{
    public static Boolean isMatch(Reminder reminder, Intent intent)
    {
        String intentAction = intent.getAction();
        String intentActionExtra = intent.getStringExtra(IntentRemapperReceiver.extraName);

        return isIdMatch(reminder, intentAction, intentActionExtra) || isActionMatch(reminder, intentAction, intentActionExtra);
    }

    private static Boolean isIdMatch(Reminder reminder, String intentAction, String intentActionExtra)
    {
        if(intentAction == Action.SmartReminder_Event_ById.name())
        {
            int reminderId = Integer.parseInt(intentActionExtra);

            if(reminder.id == reminderId)
            {
                return true;
            }
        }

        return false;
    }

    private static Boolean isActionMatch(Reminder reminder, String intentAction, String intentActionExtra)
    {
        String reminderAction = reminder.action.name();

        if(reminderAction == intentAction)
        {
            if(reminderAction == Action.SmartReminder_Event_PowerConnected.name() || reminderAction == Action.SmartReminder_Event_PowerDisconnected.name())
            {
                return true;
            }

            if(reminderAction == Action.SmartReminder_Event_WifiConnected.name() || reminderAction == Action.SmartReminder_Event_WifiDisconnected.name())
            {
                if(TextUtils.isEmpty(reminder.ssid) || reminder.ssid.equalsIgnoreCase(intentActionExtra))
                {
                    return true;
                }
            }
        }

        return false;
    }
}
