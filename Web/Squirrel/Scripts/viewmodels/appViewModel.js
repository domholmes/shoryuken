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

    vm.availableEvents = [{
        value: 0,
        text: "Charger Connected"
    },
    {
        value: 1,
        text: "Charger Disconnected"
    }];

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
        vm.saveReminder(reminder);

        reminder.editing(false);
        reminder.isNew(false);
    };

    vm.cancelEdit = function (reminder) {
        reminder.editing(false);
        if (reminder.isNew() === true) {
            vm.deleteReminder(reminder);
        } else {
            reminder.message(vm.cachedReminder.message);
            reminder.name(vm.cachedReminder.name);
            reminder.eventId(vm.cachedReminder.eventId);
            reminder.startTime(vm.cachedReminder.startTime);
            reminder.endTime(vm.cachedReminder.endTime);
            reminder.daysIds(vm.cachedReminder.daysIds);
        }
    };

    vm.saveReminder = function (reminder) {
        var unwrappedReminder = ko.toJS(reminder),
            type, url;

        if (unwrappedReminder.isNew === true) {
            type = "POST";
            url = "api/reminder/post";
        } else {
            type = "PUT";
            url = "api/reminder/put";
        }

        $.ajax({
            url: url,
            type: type,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(unwrappedReminder),
            success: function (response) {

            }
        });
    };

    vm.init = function () {
        // Perform initial load
        $.getJSON("api/reminder/get", function (allData) {
            var mappedReminders = $.map(allData, function (item) { return new sr.Reminder(item) });
            vm.reminders(mappedReminders);
        });
    };

    vm.init();
}