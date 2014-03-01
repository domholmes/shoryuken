namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUsernameUniqueConstraint : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Username", c => c.String(maxLength: 50));
            Sql("ALTER TABLE dbo.Users ADD CONSTRAINT UC_Username UNIQUE(Username)");
        }
        
        public override void Down()
        {
            Sql("ALTER TABLE [dbo].[Users] DROP CONSTRAINT [UC_Username]");
            AlterColumn("dbo.Users", "Username", c => c.String(maxLength: null));
        }
    }
}
