using System;
using System.Data.Entity;
using System.Collections.Generic;

namespace BreezeTest.Models
{
    public class BreezeSampleDatabaseInitializer :
        // If you prefer to preserve the database between server sessions
        // inherit from DropCreateDatabaseIfModelChanges
        //DropCreateDatabaseIfModelChanges<BreezeSampleContext>

        // When creating the database the first time or 
        // if you prefer to recreate with every new server session
        // inherit from DropCreateDatabaseAlways 
        DropCreateDatabaseAlways<BreezeSampleContext>
    {
        protected override void Seed(BreezeSampleContext context)
        {
            var todos = new []
                {
                    new BreezeSampleTodoItem{Description = "Wake up"},
                    new BreezeSampleTodoItem{Description = "Do dishes", IsDone = true},
                    new BreezeSampleTodoItem{Description = "Mow lawn", IsDone = true},
                    new BreezeSampleTodoItem{Description = "Try Breeze"},
                    new BreezeSampleTodoItem{Description = "Tell the world"},
                    new BreezeSampleTodoItem{Description = "Go home early"},
                };

            Array.ForEach(todos, t => context.Todos.Add(t));

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
                                Date = new DateTime(2013, 1, 25),
                                AudioUri = "http://cagcast.com/episodes/ep2.mp3"
                            },
                            new Episode
                            {
                                Title = "Ep 1: Lots of Games",
                                Description = "Shipwreck plays some games",
                                Date = new DateTime(2013, 1, 13),
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
