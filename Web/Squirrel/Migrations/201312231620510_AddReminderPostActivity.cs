namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddReminderPostActivity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "PostActivity", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Reminders", "PostActivity");
        }
    }
}
