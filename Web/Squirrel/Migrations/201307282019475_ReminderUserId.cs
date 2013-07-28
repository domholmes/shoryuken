namespace Squirrel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReminderUserId : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Reminders", name: "User_Id", newName: "UserId");
        }
        
        public override void Down()
        {
            RenameColumn(table: "dbo.Reminders", name: "UserId", newName: "User_Id");
        }
    }
}
