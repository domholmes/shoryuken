namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddReminderRepeat : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "Repeat", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Reminders", "Repeat");
        }
    }
}
