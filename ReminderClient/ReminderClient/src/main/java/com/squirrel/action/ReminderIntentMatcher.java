package com.squirrel.action;

import android.content.Intent;
import android.text.TextUtils;

import com.squirrel.domain.Reminder;

public class ReminderIntentMatcher
{
    private final String intentAction;
    private final String intentActionExtra;

    public ReminderIntentMatcher(Intent intent)
    {
        this.intentAction = intent.getAction();
        this.intentActionExtra = intent.getStringExtra(IntentRemapperReceiver.extraName);
    }

    public Boolean isIdMatch(Reminder reminder)
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

    public Boolean isActionMatch(Reminder reminder)
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
