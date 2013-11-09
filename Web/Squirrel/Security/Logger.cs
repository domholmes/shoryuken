using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Squirrel.Models;

namespace Squirrel.Security
{
    public static class Logger
    {
        private static readonly ReminderContext context;

        static Logger()
        {
            context = new ReminderContext();
        }

        public static void Log(User user, Exception exception) 
        {
            Log(user, exception.GetType().Name, exception.Message, exception.StackTrace);
        }

        public static void Log(User user, string message)
        {
            Log(user, null, message, null);    
        }

        private static void Log(User user, string exception, string message, string stackTrace)
        {
            var logEntry = new LogEntry(user, exception, message, stackTrace);

            context.LogEntries.Add(logEntry);
            context.SaveChanges();
        }
    }
}