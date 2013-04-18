using Microsoft.Web.WebPages.OAuth;

public static class AuthConfig
{
    public static void RegisterAuth()
    {
        OAuthWebSecurity.RegisterGoogleClient();
    }
}