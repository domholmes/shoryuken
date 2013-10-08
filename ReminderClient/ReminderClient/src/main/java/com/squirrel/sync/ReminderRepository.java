package com.squirrel.sync;

import android.content.Context;

import com.squirrel.domain.Reminder;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.List;

public class ReminderRepository
{
    Context context;
    private static final String REMINDERS_FILE_KEY = "reminders";

    public ReminderRepository(Context context)
    {
        this.context = context;
    }

    public void putReminders(List<Reminder> reminders) throws IOException
    {
        FileOutputStream fileOutputStream = this.context.openFileOutput(REMINDERS_FILE_KEY, Context.MODE_PRIVATE);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        objectOutputStream.writeObject(reminders);

        objectOutputStream.close();
        fileOutputStream.close();
    }

    public List<Reminder> getReminders() throws IOException
    {
        try
        {
            FileInputStream fileInputStream = context.openFileInput(REMINDERS_FILE_KEY);
            ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);

            List<Reminder> reminders = (List<Reminder>)objectInputStream.readObject();

            objectInputStream.close();
            fileInputStream.close();

            return reminders;
        }
        catch (Exception e)
        {
            List<Reminder> reminders = new ArrayList<Reminder>();

            this.putReminders(reminders);

            return reminders;
        }
    }
}
