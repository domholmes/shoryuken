define(["jquery", "ko", "signalr.hubs"], function ($, ko) {

    return function (isSignedInObservable) {

        var self;

        var requiresSync = ko.observable();  

        var callback = function () { };

        var isSignedIn = isSignedInObservable;

        function initialise() {

            $.connection.hub.disconnected(function () {
                setTimeout(function () {
                    $.connection.hub.start().done(function () {
                        self.callback();
                    })
                }, 20000);
            });

            $.connection.notificationHub.client.update = function () {
                self.callback();
            };
        }

        function onIsSignedInChange(){
            if (isSignedIn()) {
                $.connection.hub.start();
                self.callback();
            }
            else {
                //$.connection.stop();
            }
        
        }

        function notifyOthers() {
            $.connection.notificationHub.server.pushUpdate();
        }

        isSignedIn.subscribe(onIsSignedInChange)

        self = {

            initialise: initialise,
            callback: callback,
            notifyOthers: notifyOthers
        };

        return self;
    };
});