var sr = sr || {};

sr.Reminder = function (options) {
    var rem = this,
        today = new Date(),
        defaults;

    // set up default options 
    defaults = {
        id: null,
        name: '',
        message: '',
        details: '',
        startTime: new Date(today.setHours(8, 0, 0, 0)),
        endTime: new Date(today.setHours(20, 0, 0, 0)),
        date: today,
        days: [],
        repeat: false,
        active: true
    };

    $.extend(rem, defaults, options);

    // convert properties to observables
    for (var prop in rem) {
        if (rem.hasOwnProperty(prop)) {
            if (rem[prop] instanceof Array) {
                rem[prop] = ko.observableArray(rem[prop]);
            } else {
                rem[prop] = ko.observable(rem[prop]);
            }
        }
    }

    rem.isNew = ko.observable(false);
    rem.editing = ko.observable(false);
}