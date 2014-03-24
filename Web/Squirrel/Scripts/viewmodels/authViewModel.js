sr.AuthViewModel = function () {
    "use strict";

    var self, gpSignInParams;

    var antiForgeryToken = ko.observable();

    var isSignedIn = ko.observable();

    var authMessage = ko.observable();
    
    var showAuthControls = ko.computed(function () {

        return !isSignedIn();
    });

    var showDisconnect = ko.computed(function () {

        return isSignedIn();
    });

    var disconnectDialog = {
        title: 'Disconnect from Squirrel',
        message: 'Disconnecting will remove the association with your google account and clear all data, are you sure?',
        buttons: [
            {                
                cssClasses: "confirm btn btn-primary",
                text: "Yes",
                onClick: function(){
                    disconnect();
                    self.disconnectDialog.close();
                }
            },
            {                
                cssClasses: "cancel btn btn-default",
                text: "Cancel",
                onClick: function(){
                    self.disconnectDialog.close();
                }
            }
        ]
    };

    function appendGpSignInScript(options) {

        var po = document.createElement('script'), script;

        gpSignInParams = $.extend({
            callback: signInCallback,
            scope: options.scope,
            requestvisibleactions: options.activity,
            cookiepolicy: "single_host_origin"
        }, options);        

        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';

        script = document.getElementsByTagName('script')[0];
        script.parentNode.insertBefore(po, script);
    }

    function signInCallback(authResult) {

        var code, method;

        if (authResult.status.signed_in === false) {

            // need to connect account
            authMessage("");
            return;
        }

        code = authResult.code;
        method = authResult.status.method;

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

        isSignedIn.subscribe(isSignedInChange);
        antiForgeryToken.subscribe(antiForgeryTokenChange);
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

    self = {

        isSignedIn: isSignedIn,
        authMessage: authMessage,
        showAuthControls: showAuthControls,
        showDisconnect: showDisconnect,
        initialise: initialise,
        signIn: signIn,
        signOut: signOut,
        disconnectDialog: disconnectDialog
    };

    return self;
};