sr.AppViewModel = function () {

    var vm = this;

    vm.reminders = ko.observableArray([]);

    vm.isLoadingReminders = ko.observable(false);

    vm.isEditingReminder = ko.computed(function () {

        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {

            return reminder.inEditMode() === true;
        });

        return reminder !== null;
    });

    vm.canAddNewReminder = ko.computed(function () {

        return !vm.isEditingReminder();
    });

    vm.createReminder = function () {

        if (vm.canAddNewReminder()) {

            var newReminder = sr.repository.createReminder();
            newReminder.inEditMode(true);
            newReminder.postCreationSetup();

            vm.reminders.unshift(newReminder);
        }
    };

    vm.beginEditReminder = function (reminder, event) {

        event.stopPropagation();
        reminder.inEditMode(true);
    };

    vm.cancelCurrentAction = function (reminder) {

        if (reminder.isDeleting()) {

            reminder.isDeleting(false);
        }
        else if (!reminder.isSaving()) {

            var isNew = sr.repository.isNew(reminder);

            if (isNew) {
                vm.reminders.remove(reminder);
            }
            else {
                sr.repository.revertReminder(reminder);
                reminder.isSaving(false);
                reminder.inEditMode(false);
            }
        }
    };

    vm.attemptDeleteReminder = function (reminder) {
        if (!reminder.isDeleting()) {
            reminder.isDeleting(true);
        } else {
            vm.deleteReminder(reminder);
        }
    };

    vm.deleteReminder = function (reminder) {

        sr.repository.deleteReminder(reminder);
        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.inEditMode(false);
                vm.reminders.remove(reminder);
                $.connection.notificationHub.server.pushUpdate();
            },
            function (response) {// fail

                switch (response.status) {

                    case 401:
                        reminder.errors.push("You have been signed out. Attempting to sign you back in...");
                        window.location.reload();
                        break;

                    default:
                        reminder.errors.push("Delete failed, please try again later");
                        break;
                }

                reminder.isDeleting(false);
            });
    };
    
    vm.autoSaveReminder = function (reminder, property, value) {
        property(value);
        vm.saveReminder(reminder, false);
    };

    vm.manualSaveReminder = function (reminder) {
        vm.saveReminder(reminder, true);
    };

    vm.saveReminder = function (reminder, leaveEditMode) {

        reminder.isSaving(true);

        reminder.name($.trim(reminder.name()))
        reminder.message($.trim(reminder.message()))
        reminder.ssid($.trim(reminder.ssid()))

        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.isSaving(false);

                if (leaveEditMode) {
                    reminder.inEditMode(false);
                }

                $.connection.notificationHub.server.pushUpdate();
            },
            function (response) {// fail

                if (response.status) {

                    switch (response.status) {

                        case 401:
                            reminder.errors.push("You have been signed out. Attempting to sign you back in...");
                            window.location.reload();
                            break;

                        default:
                            reminder.errors.push("Save failed, please try again later");
                            break;
                    }
                }

                reminder.isSaving(false);
            });
    };

    vm.messageOnFocus = function (reminder) {
        if (!reminder.enabled()) {
            reminder.toggleEnabled();
            vm.saveReminder(reminder);
        }
    };

    vm.loadReminders = function () {

        vm.isLoadingReminders(true);

        sr.repository.fetchReminders(callback);

        function callback(data) {

            vm.isLoadingReminders(false);

            ko.utils.arrayForEach(data, function (reminder) {
                reminder.postCreationSetup();
            });

            vm.reminders(data);
        }
    };

    $.connection.hub.start();
    $.connection.notificationHub.client.update = function () {

        vm.loadReminders();
    };

    vm.loadReminders();
}