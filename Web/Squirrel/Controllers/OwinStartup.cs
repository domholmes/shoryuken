using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Squirrel.OwinStartup))]
namespace Squirrel
{
    public class OwinStartup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}