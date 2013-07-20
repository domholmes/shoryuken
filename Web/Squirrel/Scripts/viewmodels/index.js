var sr = sr || {};

sr.AppViewModel = function () {

    var vm = this;

    vm.reminders = ko.observableArray([]);

    vm.editing = ko.computed(function () {

        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {

            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    vm.createReminder = function () {

        var newReminder = window.repository.createReminder();
        newReminder.editing(true);

        vm.reminders.unshift(newReminder);
    };

    vm.beginReminderEdit = function (reminder, event) {

        reminder.editing(true);
    };

    vm.cancelReminderEdit = function (reminder, event) {

        reminder.editing(false);

        var isNew = window.repository.isNew(reminder);

        if (isNew) {
            vm.reminders.remove(reminder);
        }
        else {
            window.repository.revertReminder(reminder);
        }
    };

    vm.deleteReminder = function (reminder) {

        vm.reminders.remove(reminder);
        window.repository.deleteReminder(reminder);
        window.repository.saveChanges();
    };

    vm.saveReminders = function (reminder) {

        var hasValidationErrors = window.repository.hasErrors(reminder);

        if (!hasValidationErrors) {
            
            window.repository.saveChanges();
            reminder.editing(false);
        }
    };

    vm.loadReminders = function () {

        window.repository.fetchReminders(callback);

        function callback(data) {

            vm.reminders(data);
        }
    }

    vm.loadReminders();
}