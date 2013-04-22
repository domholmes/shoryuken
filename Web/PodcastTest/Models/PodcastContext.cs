using System.Data.Entity;

namespace PodcastTest.Controllers
{    
    public class PodcastContext : DbContext 
    {
        // DEVELOPMENT ONLY: initialize the database
        static PodcastContext()
        {
            Database.SetInitializer(new PodcastDatabaseInitializer());
        }    

        public DbSet<Subscription> Subscriptions { get; set; }
    }
    
}