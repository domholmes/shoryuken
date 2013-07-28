namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReminderRequiredConstraints : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Reminders", "User_Id", "dbo.Users");
            DropIndex("dbo.Reminders", new[] { "User_Id" });
            AlterColumn("dbo.Reminders", "User_Id", c => c.Int(nullable: false));
            AddForeignKey("dbo.Reminders", "User_Id", "dbo.Users", "Id", cascadeDelete: true);
            CreateIndex("dbo.Reminders", "User_Id");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Reminders", new[] { "User_Id" });
            DropForeignKey("dbo.Reminders", "User_Id", "dbo.Users");
            AlterColumn("dbo.Reminders", "User_Id", c => c.Int());
            CreateIndex("dbo.Reminders", "User_Id");
            AddForeignKey("dbo.Reminders", "User_Id", "dbo.Users", "Id");
        }
    }
}
