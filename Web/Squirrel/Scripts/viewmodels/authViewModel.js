sr.AuthViewModel = function () {
    "use strict";

    var antiForgeryToken = ko.observable();

    var isSignedIn = ko.observable();

    var authMessage = ko.observable();
    
    var showAuthControls = ko.computed(function () {

        return !isSignedIn();
    });

    var showDisconnect = ko.computed(function () {

        return isSignedIn();
    });

    var gpSignInParams;

    var disconnectDialog = {
        title: 'Disconnect from Squirrel',
        message: 'Disconnecting will remove the association with your google account and clear all data, are you sure?',
        buttons: [
            {
                onClick: disconnect,
                cssClasses: "confirm btn btn-primary",
                text: "Yes"
            },
            {
                onClick: function(){
                    debugger;
                },
                cssClasses: "cancel btn btn-default",
                text: "Cancel"
            }
        ]
    };

    function appendGpSignInScript(options) {

        gpSignInParams = $.extend({
            callback: signInCallback,
            scope: options.scope,
            requestvisibleactions: options.activity,
            cookiepolicy: "single_host_origin"
        }, options);

        var po = document.createElement('script'), script;

        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';

        script = document.getElementsByTagName('script')[0];
        script.parentNode.insertBefore(po, script);
    }

    function signInCallback(authResult) {

        if (authResult.status.signed_in === false) {

            // need to connect account
            authMessage("");
            return;
        }

        var code = authResult.code;
        var method = authResult.status.method;

        if (code && method === "PROMPT") {

            $.ajax({
                type: 'POST',
                url: '/Account/Callback',
                data: { code: code }
            })

            .then(
                function (token) {

                    antiForgeryToken(token);
                    isSignedIn(true);
                    authMessage("");
                },

                function (result) {

                    authMessage("Unable to sign you in, please try again later");
                }
            );

        } else if (authResult.error) {

            authMessage("Unable to sign you in, please try again later");
        }
    }

    function initialise(options) {

        appendGpSignInScript(options);

        antiForgeryToken(options.antiForgeryToken)
        isSignedIn(options.user.isAuthenticated);
    }

    function signIn() {

        authMessage("Signing you in..");
        gapi.auth.signIn(gpSignInParams);
    }

    function signOut() {

        authMessage("Signing you out..");
        $.ajax({
            type: 'POST',
            url: '/Account/SignOut'
        }).then(function () {
                    isSignedIn(false);});
    }

    function disconnect() {

        authMessage("Disconnecting..");
        $.ajax({
            type: 'POST',
            url: '/Account/Disconnect'
        })
        .then(function () {
            isSignedIn(false);
        });
    }

    function isSignedInChange() {

        if (!isSignedIn()) {
            authMessage("You have been signed out. Please sign in again to continue");
        }
        else {
            authMessage("");
        }
    }

    function antiForgeryTokenChange(token) {

        $.ajaxPrefilter(function (options) { 
            if (options.type.toUpperCase() === "POST" && !options.crossDomain) {
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('RequestVerificationToken', token);
                }
            }
        });
    }

    isSignedIn.subscribe(isSignedInChange);
    antiForgeryToken.subscribe(antiForgeryTokenChange);

    return {

        isSignedIn: isSignedIn,
        authMessage: authMessage,
        showAuthControls: showAuthControls,
        showDisconnect: showDisconnect,
        initialise: initialise,
        signIn: signIn,
        signOut: signOut,
        disconnectDialog: disconnectDialog
    };
};