package com.squirrel.sync;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.os.AsyncTask;

import com.squirrel.domain.Reminder;
import com.squirrel.location.GeofenceCreator;

import org.json.JSONArray;

public class ReminderSyncerTask extends AsyncTask<Void, Void, Void>
{
    private final Context context;
    private final ReminderApiService apiService;
    private final ReminderRepository reminderRepository;
    private  final GeofenceCreator geofenceCreator;

    public ReminderSyncerTask(Context context)
    {
        this.context = context;
        this.apiService = new ReminderApiService(context);
        this.reminderRepository = new ReminderRepository(context);
        this.geofenceCreator = new GeofenceCreator(context);
    }

    @Override
    protected Void doInBackground(Void... voids)
    {
        try
        {
            List<Reminder> reminders = this.reminderRepository.getReminders();

            reminders = this.apiService.syncReminders(reminders);

            this.reminderRepository.putReminders(reminders);

            this.geofenceCreator.CreateFromReminders(reminders);
        }
        catch (Exception e)
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