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
    rem.startTime = ko.observable(new Date(options.startTime));
    rem.endTime = ko.observable(new Date(options.endTime));
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
            id: "0",
            name: "Mon"
        },
        {
            id: "1",
            name: "Tue"
        },
        {
            id: "2",
            name: "Wed"
        },
        {
            id: "3",
            name: "Thu"
        },
        {
            id: "4",
            name: "Fri"
        },
        {
            id: "5",
            name: "Sat"
        },
        {
            id: "6",
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

    rem.formatTime = function (date) {
        var hh = date.getHours(),
            mm = date.getMinutes(),
            ss = date.getSeconds(),
            suffix;

        if (hh >= 12) {
            suffix = "PM";
            if (hh > 12) {
                hh = hh - 12;
            }
        } else {
            suffix = "AM";
        }

        if (hh < 10) { hh = "0" + hh; }
        if (mm < 10) { mm = "0" + mm; }
        if (ss < 10) { ss = "0" + ss; }

        return hh + ":" + mm + " " + suffix;
    };

    rem.startTimeDisplay = ko.computed({
        read: function () {
            return rem.formatTime(rem.startTime());
        },
        write: function (value) {
            rem.startTime(rem.dateStringToDate(value));
        },
        owner: this
    });

    rem.endTimeDisplay = ko.computed({
        read: function () {
            return rem.formatTime(rem.endTime());
        },
        write: function (value) {
            rem.endTime(rem.dateStringToDate(value));
        },
        owner: this
    });

    rem.dateStringToDate = function (str) {
        var date = new Date(),
            hours = parseInt(str.substring(0, 2), 10),
            minutes = parseInt(str.substring(3, 5), 10),
            meridian = str.match(/AM|PM/gi);

        if (meridian !== null) {
            meridian = meridian[0].toUpperCase();
        }

        if (meridian === "PM") {
            if (hours < 12) {
                hours += 12;
            }
        } else if (meridian === "AM") {
            if (hours === 12) {
                hours = 0;
            }
        }

        return new Date(date.setHours(hours, minutes));
    };
}