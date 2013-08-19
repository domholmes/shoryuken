package com.squirrel.sync;

import java.io.IOException;
import java.util.ArrayList;

import android.content.Context;
import android.os.AsyncTask;

import com.squirrel.domain.Reminder;

import org.json.JSONArray;
import org.json.JSONObject;

class ReminderSyncerTask extends AsyncTask<Void, Void, Void>
{
    private ReminderApiService apiService;
    private ReminderJsonMapper jsonMapper;
    private ReminderStore reminderStore;

    public ReminderSyncerTask(Context context)
    {
        this.apiService = new ReminderApiService(context);
        this.jsonMapper = new ReminderJsonMapper();
        this.reminderStore = new ReminderStore(context);
    }

    @Override
    protected Void doInBackground(Void... voids)
    {
        ArrayList<Reminder> reminders = new ArrayList<Reminder>();

        try
        {
            JSONArray jArray = this.apiService.getRemindersJson();

            for(int i=0; i< jArray.length(); i++)
            {
                JSONObject reminderJson = jArray.getJSONObject(i);

                Reminder reminder = this.jsonMapper.CreateReminderFromJson(reminderJson);

                reminders.add(reminder);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        try
        {
            this.reminderStore.putReminders(reminders);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return null;
    }

    protected void onProgressUpdate() {
    }

    protected void onPostExecute() {
    }
}