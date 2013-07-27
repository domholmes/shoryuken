namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Validation : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Reminders", "Name", c => c.String(maxLength: 50));
            AlterColumn("dbo.Reminders", "Message", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Reminders", "StartTime", c => c.String());
            AlterColumn("dbo.Reminders", "EndTime", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Reminders", "EndTime", c => c.Time(nullable: false));
            AlterColumn("dbo.Reminders", "StartTime", c => c.Time(nullable: false));
            AlterColumn("dbo.Reminders", "Message", c => c.String(nullable: false));
            AlterColumn("dbo.Reminders", "Name", c => c.String());
        }
    }
}
