var sr = sr || {};

sr.Reminder = function (options) {
    var r = this,
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

    $.extend(r, defaults, options);

    // convert properties to observables
    for (var prop in r) {
        if (r.hasOwnProperty(prop)) {
            if (r[prop] instanceof Array) {
                r[prop] = ko.observableArray(r[prop]);
            } else {
                r[prop] = ko.observable(r[prop]);
            }
        }
    }
}