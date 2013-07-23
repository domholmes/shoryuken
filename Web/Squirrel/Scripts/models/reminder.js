var sr = window.sr || {};

sr.Reminder = function () {

    var rem = this,

        reminderDefaults = {

            enabled: true,
            startTime: 'PT8H',
            endTime: 'PT9H',
            days: '23456'
        };

    // this.days = ko.observableArray(this.days.split);
    this.editing = ko.observable(false);

    this.availableEvents = [
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

    this.availableDays = [
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

    this.isDaySelected = function (day) {
        return this.days().indexOf(day.id) > -1;
    };

    this.changeDay = function (day) {
        if (rem.days().indexOf(day.id) > -1) {
            rem.days.remove(day.id);
        } else {
            rem.days.push(day.id);
        }
    };
};