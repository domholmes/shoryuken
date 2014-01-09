namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserAccessToken : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "AccessToken", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "AccessToken");
        }
    }
}
