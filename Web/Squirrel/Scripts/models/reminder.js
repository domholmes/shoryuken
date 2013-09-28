var sr = window.sr || {};

sr.reminderDefaults = {

    enabled: true,
    startTime: '00:00',
    endTime: '23:59',
    days: '2345671',
    actionId: 4
};

sr.Reminder = function () {

    var rem = this, counter = 0;

    function selectedEventIs(events) {
        var eventsToMatch, idsToMatch;

        eventsToMatch = ko.utils.arrayFilter(rem.availableEvents(), function (event) {
            return $.inArray(event.constant, events) > -1;
        });

        idsToMatch = ko.utils.arrayMap(eventsToMatch, function (event) {
            return event.value;
        });

        return $.inArray(rem.actionId(), idsToMatch) > -1;
    }

    function publishLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $.publish("currentLocation", position);
            });
        }
    }

    rem.editing = ko.observable(false);

    rem.saving = ko.observable(false);

    // TODO: temporary mocked property
    rem.notifyOnce = ko.observable(false);

    rem.availableEvents = [
        {
            constant: "WIFI_CONNECT",
            value: 0,
            text: "Wifi Connected"
        },
        {
            constant: "WIFI_DISCONNECT",
            value: 1,
            text: "Wifi Disconnected"
        },
        {
            constant: "CHARGER_CONNECT",
            value: 2,
            text: "Charger Connected"
        },
        {
            constant: "CHARGER_DISCONNECT",
            value: 3,
            text: "Charger Disconnected"
        },
        {
            constant: "LOCATION_ENTER",
            value: 4,
            text: "Location Enter"
        },
        {
            constant: "LOCATION_LEAVE",
            value: 5,
            text: "Location Leave"
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

    rem.setToAm = function () {
        rem.startTime("00:00");
        rem.endTime("12:00");
    };

    rem.setToPm = function () {
        rem.startTime("12:00");
        rem.endTime("23:59");
    };

    rem.setToWhenever = function () {
        rem.startTime("00:00");
        rem.endTime("23:59");
    };

    rem.wheneverClick = function (reminder, event) {
        reminder.setToWhenever();
    };

    rem.postCreationSetup = function () {

        rem.showSSIDField = ko.computed(function () {
            return selectedEventIs(["WIFI_CONNECT", "WIFI_DISCONNECT"]);
        });

        rem.showAddressField = ko.computed(function () {
            return selectedEventIs(["LOCATION_ENTER", "LOCATION_LEAVE"]);
        });

        rem.showAddressField.subscribe(function (newValue) {
            if (newValue) {
                publishLocation();
            }
        });

        rem.editing.subscribe(function (newValue) {
            if (newValue && rem.showAddressField()) {
                publishLocation();
            }
        });

    };
};