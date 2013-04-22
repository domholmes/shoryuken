using System;
using System.Data.Entity;
using System.Collections.Generic;

namespace PodcastTest.Controllers
{
    public class PodcastDatabaseInitializer :
        // If you prefer to preserve the database between server sessions
        // inherit from DropCreateDatabaseIfModelChanges
        //DropCreateDatabaseIfModelChanges<BreezeSampleContext>

        // When creating the database the first time or 
        // if you prefer to recreate with every new server session
        // inherit from DropCreateDatabaseAlways 
        DropCreateDatabaseIfModelChanges<PodcastContext>
    {
        protected override void Seed(PodcastContext context)
        {
            var subscriptions = new[]
            {
                new Subscription
                {
                    Name = "CAGCast",
                    FeedUri = "http://cagcast.com/feed.xml",
                    Episodes = new List<Episode>
                    {
                        new Episode
                        {
                            Title = "Ep 2: Tokyo America Club",
                            Description = "Cheapy visits the club, again",
                            AudioUri = "http://cagcast.com/episodes/ep2.mp3"
                        },
                        new Episode
                        {
                            Title = "Ep 1: Lots of Games",
                            Description = "Shipwreck plays some games",
                            AudioUri = "http://cagcast.com/episodes/ep1.mp3"
                        }
                    }
                }  
            };

            Array.ForEach(subscriptions, s => context.Subscriptions.Add(s));


            context.SaveChanges(); // Save 'em
        }
    }
}
