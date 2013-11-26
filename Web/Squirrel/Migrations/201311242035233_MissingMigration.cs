namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MissingMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LogEntries",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Exception = c.String(),
                        Message = c.String(),
                        StackTrace = c.String(),
                        User_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.LogEntries", new[] { "User_Id" });
            DropForeignKey("dbo.LogEntries", "User_Id", "dbo.Users");
            DropTable("dbo.LogEntries");
        }
    }
}
