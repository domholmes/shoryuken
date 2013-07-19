var sr = sr || {};

sr.AppViewModel = function () {

    var vm = this;

    vm.reminders = ko.observableArray([]);

    vm.availableEvents = window.reminder.availableEvents;

    vm.availableDays = window.reminder.availableDays;

    vm.editing = ko.computed(function () {

        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {

            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    vm.createReminder = function () {

        var reminderDefaults = {

            name: 'Some default'
        };

        var newReminder = window.repository.createReminder(reminderDefaults);
        newReminder.editing(true);

        vm.reminders.unshift(newReminder);
    };

    vm.beginReminderEdit = function (reminder, event) {

        reminder.editing(true);
    };

    vm.cancelReminderEdit = function (reminder, event) {

        reminder.editing(false);

        if (reminder.isNew() === true) {

            vm.reminders.remove(reminder);
        }
        else {

            window.repository.revertReminder(reminder)
        }
    };

    vm.deleteReminder = function (reminder) {

        vm.reminders.remove(reminder);
        window.repository.deleteReminder(reminder);
        window.repository.saveChanges();
    };

    vm.saveReminders = function () {

        // attach any new?
        window.repository.saveChanges();

        reminder.editing(false);
    };

    vm.loadReminders = function () {

        window.repository.addAdditionalProperties(function () {

            this.editing = ko.observable(false);

            this.isSelectedDay = function (day) {
                return this.days().indexOf(day.id) > -1;
            };

            this.dayClick = function (day) {
                if (this.days().indexOf(day.id) > -1) {
                    this.days.remove(day.id);
                } else {
                    this.days.push(day.id);
                }
            };
        });

        window.repository.fetchReminders(callback);

        function callback(data) {

            vm.reminders(data);
        }
    }

    vm.loadReminders();
}