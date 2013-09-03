namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLatLong : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "LatLong", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Reminders", "LatLong");
        }
    }
}
