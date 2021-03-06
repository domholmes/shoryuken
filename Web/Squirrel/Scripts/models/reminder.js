﻿define(["jquery", "ko"], function ($, ko) {

    // Reminder ctor to extend entities created by Breeze
    return function () {
        "use strict";

        var rem = this,
            START_DAY = "00:00",
            MID_DAY = "12:00",
            END_DAY = "23:59";

        function selectedEventIs(events) {
            var eventsToMatch, idsToMatch;

            eventsToMatch = ko.utils.arrayFilter(rem.availableEvents(), function (event) {
                return $.inArray(event.value, events) > -1;
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

        rem.inEditMode = ko.observable(false);

        rem.isSaving = ko.observable(false);

        rem.isDeleting = ko.observable(false);

        rem.availableEvents = [
            {
                value: "WifiConnected",
                text: "Wifi Connected"
            },
            {
                value: "WifiDisconnected",
                text: "Wifi Disconnected"
            },
            {
                value: "ChargerConnected",
                text: "Charger Connected"
            },
            {
                value: "ChargerDisconnected",
                text: "Charger Disconnected"
            },
            {
                value: "LocationEnter",
                text: "Location Enter"
            },
            {
                value: "LocationLeave",
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

        rem.canPostCheckIn = function () {
            return rem.actionId == "LocationEnter";
        };

        rem.toggleDay = function (day) {
            var days = rem.days();

            if (days.indexOf(day.id) > -1) {
                rem.days(days.replace(day.id, ""));
            } else {
                rem.days(days + day.id);
            }
        };

        rem.toggleEnabled = function () {
            rem.enabled(!rem.enabled());
        };

        rem.toggleRepeat = function () {
            rem.repeat(!rem.repeat());
        };

        rem.togglePostActivity = function () {
            rem.postActivity(!rem.postActivity());
        };

        rem.setToAM = function () {
            rem.startTime(START_DAY);
            rem.endTime(MID_DAY);
        };

        rem.setToPM = function () {
            rem.startTime(MID_DAY);
            rem.endTime(END_DAY);
        };

        rem.setToWhenever = function () {
            rem.startTime(START_DAY);
            rem.endTime(END_DAY);
        };      

        rem.setDefaults = function () {

            rem.enabled(true),
            rem.startTime(START_DAY),
            rem.endTime(END_DAY),
            rem.days("2345671"),
            rem.actionId("LocationEnter")
        }

        rem.postCreationSetup = function () {

            rem.showSSIDField = ko.computed(function () {
                return selectedEventIs(["WifiConnected", "WifiDisconnected"]);
            });

            rem.showAddressField = ko.computed(function () {
                return selectedEventIs(["LocationEnter", "LocationLeave"]);
            });

            rem.isSetToAM = ko.computed(function () {
                return rem.startTime() === START_DAY &&
                    rem.endTime() === MID_DAY;
            });

            rem.isSetToPM = ko.computed(function () {
                return rem.startTime() === MID_DAY &&
                    rem.endTime() === END_DAY;
            });

            rem.isSetToWhenever = ko.computed(function () {
                return rem.startTime() === START_DAY &&
                    rem.endTime() === END_DAY;
            });

            rem.showAddressField.subscribe(function (newValue) {
                if (newValue) {
                    publishLocation();
                }
            });

            rem.inEditMode.subscribe(function (newValue) {
                if (newValue && rem.showAddressField()) {
                    publishLocation();
                }
            });

            rem.errors.subscribe(function (newValue) {
                if (newValue.length > 0) {
                    rem.inEditMode(true);
                }
            });
        };
    };
});