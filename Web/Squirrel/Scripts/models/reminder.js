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
            text: "Wifi Connected",
            hasExtra: true
        },
        {
            value: 1,
            text: "Wifi Disconnected",
            hasExtra: true
        },
        {
            value: 2,
            text: "Charger Connected",
            hasExtra: false
        },
        {
            value: 3,
            text: "Charger Disconnected",
            hasExtra: false
        }
    ];

    rem.actionHasExtra = ko.computed(
    {
        read: function () {

            var id = rem.actionId();
            var matchingEvent;

            $.each(rem.availableEvents(), function (index, event) {

                if (event.value == id) {

                    matchingEvent = event;
                    return;
                }
            });

            return matchingEvent.hasExtra;
        },

        // required because actionId not yet defined
        deferEvaluation: true
    });

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

    rem.setToAm = function () {
        rem.startTime("00:00");
        rem.endTime("12:00");
    }

    rem.setToPm = function () {
        rem.startTime("12:00");
        rem.endTime("00:00");
    }
};