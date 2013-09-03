namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPlaceName : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Reminders", "PlaceName", c => c.String(maxLength: 200));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Reminders", "PlaceName");
        }
    }
}
