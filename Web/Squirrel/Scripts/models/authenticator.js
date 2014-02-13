sr.Authenticator = function () {
    "use strict";

    var gpSignInParams;

    function appendGpSignInScript() {

        var po = document.createElement('script'), script;

        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';

        script = document.getElementsByTagName('script')[0];
        script.parentNode.insertBefore(po, script);
    }

    function signInCallback(authResult) {

        if (authResult.status.signed_in === false) {

            $.publish('authentication', { status: 'unauthenticated', message: 'Sign in failed' });

            return;
        }

        var code = authResult['code'];

        if (code) {

            $.publish('authentication', { status: 'authenticating', message: 'Signing in...' });

            // make the call to the server to validate the google token and sign user in
            $.ajax({
                type: 'POST',
                url: '/Account/Callback',
                data: { code: code }
            })

            .then(
                function (result) {

                    // success

                    $.publish('authentication', { status: 'authenticated' });
                },

                function (result) {

                    // fail

                    $.publish('authentication', { status: 'unauthenticated', message: 'Sign in failed' });
                }
            );

        } else if (authResult['error']) {

            // There was an error.
            // Possible error codes:
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatially log in the user
            // console.log('There was an error: ' + authResult['error']);
        }
    }

    function gpSignIn() {
        gapi.auth.signIn(gpSignInParams);
    }

    function init(options) {

        gpSignInParams = $.extend({
            callback: signInCallback,
            requestvisibleactions: "http://schemas.google.com/AddActivity",
            cookiepolicy: "single_host_origin"
        }, options);

        appendGpSignInScript();
    }

    return {
        init: init,
        gpSignIn: gpSignIn
    };
};