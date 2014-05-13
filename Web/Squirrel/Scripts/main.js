requirejs.config({
    baseUrl: '/Scripts',
    paths: {
        breeze: 'breeze.min',
        'jquery': 'jquery-2.1.0',
        'ko': 'knockout-3.0.0',
        'Q': 'q',
        'signalr.hubs': '../signalr/hubs?',
        'signalr.core': 'jquery.signalR-2.0.1.min'
    },
    shim: {
        'signalr.hubs': {
            deps: ['signalr.core','jquery'],
        }
    },
    waitSeconds: 90
});

define('gapi', ['async!https://apis.google.com/js/client.js!onload'],
    function () {
        return gapi;
    }
);

define('gmaps', ['async!http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&language=en'],
    function () {
        return google;
    }
);

require(['app/app'], function (app) {

    app.start();
});