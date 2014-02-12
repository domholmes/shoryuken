var sr = window.sr || {},

    userDefaults = {
        isAuthenticated: false
    };

sr.User = function (options) {
    "use strict";

    var user = this;

    options = $.extend(userDefaults, options);

    user.isAuthenticated = ko.observable(options.isAuthenticated);

};