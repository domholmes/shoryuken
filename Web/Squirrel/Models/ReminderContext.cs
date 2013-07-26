using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Squirrel.Migrations;

namespace Squirrel.Models
{
    public class ReminderContext : DbContext
    {
        static ReminderContext()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ReminderContext, Configuration>());
        }
        
        public DbSet<Reminder> Reminders { get; set; }

        public DbSet<User> Users { get; set; }
    }
}