var sr = sr || {};

sr.AppViewModel = function () {
    var vm = this;

    // Data
    vm.reminders = ko.observableArray([]);
    vm.editing = ko.computed(function () {
        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {
            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    // Operations
    vm.createReminder = function () {
        var reminder = new sr.Reminder();

        reminder.isNew(true);
        reminder.editing(true);
        vm.reminders.push(reminder);
    };

    vm.editReminder = function (reminder) {
        vm.cachedReminder = ko.toJS(reminder);
        reminder.editing(true);
    };

    vm.deleteReminder = function (reminder) {
        vm.reminders.remove(reminder);
    };

    vm.endEdit = function (reminder) {
        reminder.editing(false);
        reminder.isNew(false);
    };

    vm.cancelEdit = function (reminder) {
        reminder.editing(false);
        if (reminder.isNew() === true) {
            vm.deleteReminder(reminder);
        } else {
            reminder.message(vm.cachedReminder.message);
        }
    };

    // Perform initial load
    $.getJSON("api/reminder/get", function (allData) {

        var mappedReminders = $.map(allData, function (item) { return new sr.Reminder(item) });
        vm.reminders(mappedReminders);
    });
}