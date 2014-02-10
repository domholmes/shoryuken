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

            // make sure button is not display:none and fade in if opacity 0
            $('.gplus-button').show().animate({ opacity: 1 }, 200);

            return;
        }

        $('.gplus-button').animate({ opacity: 0 }, 200, function () {
            var code = authResult['code'];

            // give .signin-button display:none, in effect removing it
            $(this).hide();

            if (code) {

                // make sure signing in message is not display:none and fade in if opacity 0
                $('.authenticating').show().animate({ opacity: 1 }, 200, function () {

                    // make the call to the server to validate the google token and sign user in
                    $.ajax({
                        type: 'POST',
                        url: '/Account/Callback',
                        data: { code: code }
                    })

                    .then(
                        function (result) {

                            // success

                            // fade out signing in message
                            $('.authenticating').animate({ opacity: 0 }, 200, function () {

                                // completely hide invisible signing in message
                                $(this).hide();

                                // publish authentication event as the user is now authenticated
                                $.publish('authentication', true);

                            });
                        },

                        function (result) {

                            // fail

                            // fade out signing in message
                            $('.authenticating').animate({ opacity: 0 }, 200, function () {

                                // completely hide invisible signing in message
                                $(this).hide();

                                // fade in failed message if opacity 0
                                $('.signin-failed').animate({ opacity: 1 }, 200, function () {

                                    // pause on failed message for 3 seconds
                                    setTimeout(function () {

                                        // fade out failed message
                                        $('.signin-failed').animate({ opacity: 0 }, 200, function () {

                                            // fade the sign in button back in
                                            $('.gplus-button').show().animate({ opacity: 1 }, 200, function () {

                                            });
                                        });
                                    }, 3000);
                                });
                            });
                        }
                    );
                });

            } else if (authResult['error']) {

                // There was an error.
                // Possible error codes:
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatially log in the user
                // console.log('There was an error: ' + authResult['error']);
            }
        });
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