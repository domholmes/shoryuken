var sr = window.sr || {};

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
        days: null,
        actionId: null,
        active: true
    };

    options = $.extend(defaults, options);

    options.days = options.days === null ? [] : options.days.split('');

    // convert properties to observables
    rem.id = options.id;
    rem.name = ko.observable(options.name);
    rem.message = ko.observable(options.message);
    rem.details = ko.observable(options.details);
    rem.startTime = ko.observable("10:45");
    rem.endTime = ko.observable("16:22");
    rem.actionId = ko.observable(options.actionId);
    rem.active = ko.observable(options.active);
    rem.days = ko.observableArray(options.days);

    rem.availableEvents = [
        {
            value: 0,
            text: "Wifi Connected"
        },
        {
            value: 1,
            text: "Wifi Disconnected"
        },
        {
            value: 2,
            text: "Charger Connected"
        },
        {
            value: 3,
            text: "Charger Disconnected"
        }
    ];

    rem.availableDays = [
        {
            id: "2",
            name: "Mon"
        },
        {
            id: "3",
            name: "Tue"
        },
        {
            id: "4",
            name: "Wed"
        },
        {
            id: "5",
            name: "Thu"
        },
        {
            id: "6",
            name: "Fri"
        },
        {
            id: "7",
            name: "Sat"
        },
        {
            id: "1",
            name: "Sun"
        }
    ];

    rem.isNew = ko.observable(false);
    rem.editing = ko.observable(false);

    rem.isSelectedDay = function (day) {
        return rem.days().indexOf(day.id) > -1;
    };

    rem.dayClick = function (day) {
        if (rem.days().indexOf(day.id) > -1) {
            rem.days.remove(day.id);
        } else {
            rem.days.push(day.id);
        }
    };    
}