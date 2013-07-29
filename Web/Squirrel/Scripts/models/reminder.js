var sr = window.sr || {};

sr.reminderDefaults = {

    enabled: true,
    startTime: '08:00',
    endTime: '09:00',
    days: '23456',
    actionId: 3
};

sr.Reminder = function () {

    var rem = this;

    rem.editing = ko.observable(false);

    rem.saving = ko.observable(false);

    // TODO: temporary mocked property
    rem.notifyOnce = ko.observable(false);

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

    rem.isDaySelected = function (day) {
        return rem.days().indexOf(day.id) > -1;
    };

    rem.changeDay = function (day) {
        var days = rem.days();

        if (days.indexOf(day.id) > -1) {
            rem.days(days.replace(day.id, ""));
        } else {
            rem.days(days + day.id);
        }
    };

    rem.enable = function () {
        rem.enabled(!rem.enabled());
    };
};