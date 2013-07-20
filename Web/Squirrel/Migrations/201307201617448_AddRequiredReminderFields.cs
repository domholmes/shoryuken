namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRequiredReminderFields : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Reminders", "Message", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Reminders", "Message", c => c.String());
        }
    }
}
