using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Squirrel.Models
{
    public class LogEntry
    {
        public LogEntry(User user, string exception, string message, string stackTrace)
        {
            this.Date = DateTime.Now;
            this.User = user;
            this.Exception = exception;
            this.Message = message;
            this.StackTrace = stackTrace;
        }

        public int Id { get; set; }

        public DateTime Date { get; private set; }

        public User User { get; set; }

        public string Exception { get; set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }
    }
}