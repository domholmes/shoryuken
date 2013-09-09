namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameExtraToSsid : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "Ssid", c => c.String(maxLength: 20));
            DropColumn("dbo.Reminders", "ActionExtra");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Reminders", "ActionExtra", c => c.String(maxLength: 20));
            DropColumn("dbo.Reminders", "Ssid");
        }
    }
}
