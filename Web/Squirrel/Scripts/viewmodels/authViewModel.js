sr.AuthViewModel = function () {
    "use strict";

    var isSignedIn = ko.observable();

    var authMessage = ko.observable();

    var gpSignInParams;

    var showSignInButton = ko.computed(function () {

        return !isSignedIn();
    });

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

            // need to connect
            return;
        }

        var code = authResult['code'];

        if (code) {

            $.ajax({
                type: 'POST',
                url: '/Account/Callback',
                data: { code: code }
            })

            .then(
                function (result) {

                    isSignedIn(true);
                },

                function (result) {

                    authMessage("Unable to sign you in, please try again later");
                }
            );

        } else if (authResult['error']) {

        }
    }

    function init(options) {

        isSignedIn(options.user.isAuthenticated);

        gpSignInParams = $.extend({
            callback: signInCallback,
            scope: options.scope,
            requestvisibleactions: options.activity,
            cookiepolicy: "single_host_origin"
        }, options);

        appendGpSignInScript();

        isSignedIn.subscribe(isSignedInChange);
    }

    function signIn() {

        gapi.auth.signIn(gpSignInParams);
    }

    function isSignedInChange(signedIn) {

        if (!signedIn) {
            authMessage("You have been signed out. Please sign in again to continue");
        }
        else {
            authMessage("");
        }
    }

    return {

        isSignedIn: isSignedIn,
        authMessage: authMessage,
        showSignInButton: showSignInButton,
        init: init,
        signIn: signIn
    };
};