package com.squirrel.sync;

import android.content.Context;

import com.squirrel.domain.Reminder;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;

public class ReminderStore
{
    Context context;
    private static final String FILE_KEY = "reminders";

    public ReminderStore(Context context)
    {
        this.context = context;
    }

    public void putReminders(ArrayList<Reminder> reminders) throws IOException
    {
        FileOutputStream fileOutputStream = this.context.openFileOutput(FILE_KEY, Context.MODE_PRIVATE);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        objectOutputStream.writeObject(reminders);

        objectOutputStream.close();
        fileOutputStream.close();
    }

    public ArrayList<Reminder> getReminders() throws IOException, ClassNotFoundException
    {
        FileInputStream fileInputStream = context.openFileInput(FILE_KEY);
        ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);

        return (ArrayList<Reminder>)objectInputStream.readObject();
    }
}
