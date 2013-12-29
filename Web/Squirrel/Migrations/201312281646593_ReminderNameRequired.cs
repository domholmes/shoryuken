namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReminderNameRequired : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Reminders SET Name = 'No Name' WHERE Name IS NULL");
            AlterColumn("dbo.Reminders", "Name", c => c.String(nullable: false, maxLength: 50, defaultValue: "Name"));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Reminders", "Name", c => c.String(maxLength: 50));
        }
    }
}
