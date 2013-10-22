using System.Data.Entity;

namespace Squirrel.Models
{
    public class ReminderContext : DbContext
    {
        public DbSet<Reminder> Reminders { get; set; }

        public DbSet<User> Users { get; set; }
    }
}