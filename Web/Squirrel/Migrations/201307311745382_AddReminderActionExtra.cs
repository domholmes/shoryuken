namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddReminderActionExtra : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "ActionExtra", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Reminders", "ActionExtra");
        }
    }
}
