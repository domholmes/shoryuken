using System.Data.Entity;

namespace SmartReminder.Models
{    
    public class ReminderContext : DbContext 
    {
        // DEVELOPMENT ONLY: initialize the database
        static ReminderContext()
        {
            Database.SetInitializer(new RemindertDatabaseInitializer());
        }    

        public DbSet<Reminder> Reminders{ get; set; }
    }
    
}