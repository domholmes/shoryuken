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

        var newReminder = sr.repository.createReminder();
        newReminder.editing(true);

        vm.reminders.unshift(newReminder);
    };

    vm.beginReminderEdit = function (reminder, event) {

        reminder.editing(true);
    };

    vm.cancelReminderEdit = function (reminder, event) {

        reminder.editing(false);

        var isNew = sr.repository.isNew(reminder);

        if (isNew) {
            vm.reminders.remove(reminder);
        }
        else {
            sr.repository.revertReminder(reminder);
        }
    };

    vm.editReminder = function (reminder, event) {

        vm.cachedReminder = ko.toJS(reminder);

        reminder.editing(true);
    };

    vm.deleteReminder = function (reminder) {

        vm.reminders.remove(reminder);
        sr.repository.deleteReminder(reminder);
        sr.repository.saveChanges();
    };

    vm.saveReminders = function (reminder) {

        var hasValidationErrors = sr.repository.hasErrors(reminder);

        if (!hasValidationErrors) {
            
            sr.repository.saveChanges();
            reminder.editing(false);
        }
    };

    vm.loadReminders = function () {

        sr.repository.fetchReminders(callback);

        function callback(data) {

            vm.reminders(data);
        }
    }

    vm.loadReminders();
}