sr.AppViewModel = function () {

    var vm = this;

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
            newReminder.postCreationSetup();

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

        // TODO: Remove ssid/place if a different action is selected

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

            ko.utils.arrayForEach(data, function (reminder) {
                reminder.postCreationSetup();
            });

            vm.reminders(data);            
        }
    };

    vm.loadReminders();
}