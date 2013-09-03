sr.AppViewModel = function () {

    var vm = this,

        geoLocationBinder = function (changeArgs) {

            if (changeArgs.propertyName === "actionId" && changeArgs.newValue === 4) { // location

                if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition(function (position) {
                        $.publish("currentLocation", position);
                    });

                }
            }
        };

    vm.reminders = ko.observableArray([]);

    vm.editing = ko.computed(function () {

        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {

            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    vm.canAddNew = ko.computed(function () {

        return !vm.editing();
    });

    vm.createReminder = function () {

        if (vm.canAddNew()) {

            var newReminder = sr.repository.createReminder();
            newReminder.editing(true);
            newReminder.entityAspect.propertyChanged.subscribe(geoLocationBinder);

            vm.reminders.unshift(newReminder);
        }
    };

    vm.beginReminderEdit = function (reminder, event) {

        reminder.editing(true);
    };

    vm.cancelReminderEdit = function (reminder, event) {

        if (!reminder.saving()) {

            var isNew = sr.repository.isNew(reminder);

            if (isNew) {
                vm.reminders.remove(reminder);
            }
            else {
                sr.repository.revertReminder(reminder);
                reminder.saving(false);
                reminder.editing(false);
            }
        }
    };

    vm.deleteReminder = function (reminder) {

        vm.reminders.remove(reminder);
        sr.repository.deleteReminder(reminder);
        sr.repository.saveReminder(reminder, function () {

            reminder.editing(false);
        });
    };

    vm.saveReminder = function (reminder) {

        reminder.saving(true);

        if (!reminder.actionHasExtra()) {

            reminder.actionExtra(null);
        }

        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.saving(false);
                reminder.editing(false);
            },
            function () {// fail

                reminder.saving(false);
            });
    };

    vm.loadReminders = function () {

        sr.repository.fetchReminders(callback);

        function callback(data) {

            vm.reminders(data);

            ko.utils.arrayForEach(vm.reminders(), function (reminder) {
                reminder.entityAspect.propertyChanged.subscribe(geoLocationBinder);
            });
        }
    };

    vm.loadReminders();
}