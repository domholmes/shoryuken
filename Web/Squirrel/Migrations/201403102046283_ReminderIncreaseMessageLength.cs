namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReminderIncreaseMessageLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Reminders", "Message", c => c.String(nullable: false, maxLength: 250));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Reminders", "Message", c => c.String(nullable: false, maxLength: 50));
        }
    }
}
