sr.AppViewModel = function () {

    var vm = this;

    vm.reminders = ko.observableArray([]);

    vm.loading = ko.observable(false);

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
            newReminder.postCreationSetup();

            vm.reminders.unshift(newReminder);
        }
    };

    vm.beginReminderEdit = function (reminder, event) {

        event.stopPropagation();
        reminder.editing(true);
    };

    vm.reminderDeleteClick = function (reminder) {
        if (!reminder.deleting()) {
            reminder.deleting(true);
        } else {
            vm.deleteReminder(reminder);
        }
    };

    vm.reminderCancelClick = function (reminder) {

        if (reminder.deleting()) {
            reminder.deleting(false);
        } else {
            vm.cancelReminderEdit(reminder);
        }
    };

    vm.reminderSaveClick = function (reminder) {
        if (!reminder.deleting()) {
            vm.saveReminder(reminder);
        }
    };

    vm.cancelReminderEdit = function (reminder) {

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

        sr.repository.deleteReminder(reminder);
        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.editing(false);
                vm.reminders.remove(reminder);
            },
            function (response) {// fail

                switch (response.status) {

                    case 401:
                        reminder.errors.push("You have been signed out. Please refresh your browser to sign in again.");
                        break;

                    default:
                        reminder.errors.push("Delete failed, please try again later");
                        break;
                }

                reminder.deleting(false);
            });
    };

    vm.saveReminder = function (reminder) {

        reminder.saving(true);

        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.saving(false);
                reminder.editing(false);
            },
            function (response) {// fail

                if (response.status) {

                    switch (response.status) {

                        case 401:
                            reminder.errors.push("You have been signed out. Please refresh your browser to sign in again.");
                            break;

                        default:
                            reminder.errors.push("Save failed, please try again later");
                            break;
                    }
                }

                reminder.saving(false);
            });
    };

    cardDisplayClick = function (reminder, event) {
        reminder.enable();
        vm.saveReminder(reminder);
    };

    vm.loadReminders = function () {

        vm.loading(true);

        sr.repository.fetchReminders(callback);

        function callback(data) {

            vm.loading(false);

            ko.utils.arrayForEach(data, function (reminder) {
                reminder.postCreationSetup();
            });

            vm.reminders(data);
        }
    };

    vm.loadReminders();
}