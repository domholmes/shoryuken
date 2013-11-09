namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserNotificationKey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "NotificationKey", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "NotificationKey");
        }
    }
}
