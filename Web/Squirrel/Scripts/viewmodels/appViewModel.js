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
        vm.reminders.unshift(reminder);
        $('.timepicker').timepicker({ showMeridian: false });
    };

    vm.editReminder = function (reminder) {
        vm.cachedReminder = ko.toJS(reminder);
        $('.timepicker').timepicker({ showMeridian: false });        
        $("textarea").keyup(function (e) {
            self.setTextareaSize($(this));
        });
        reminder.editing(true);
        self.setTextareaSize($("textarea"));
    };

    vm.deleteReminder = function (reminder) {

        vm.reminders.remove(reminder);

        if (reminder.id !== null) {
            $.ajax({
                type: "DELETE",
                url: "api/reminder/delete/?id=" + reminder.id,
                success: function (response) {

                }
            });
        }
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
            reminder.actionId(vm.cachedReminder.actionId);
            reminder.startTime(vm.cachedReminder.startTime);
            reminder.endTime(vm.cachedReminder.endTime);
            reminder.days(vm.cachedReminder.days);
        }
    };

    vm.saveReminder = function (reminder) {
        var unwrappedReminder = ko.toJS(reminder),
            type, url;

        unwrappedReminder.days = unwrappedReminder.days.join('');

        if (unwrappedReminder.isNew === true) {
            type = "POST";
            url = "api/reminder/post";
        } else {
            type = "PUT";
            url = "api/reminder/put";
        }

        delete unwrappedReminder.availableDays;
        delete unwrappedReminder.availableEvents;
        delete unwrappedReminder.editing;
        delete unwrappedReminder.startTimeDisplay;
        delete unwrappedReminder.endTimeDisplay;
        delete unwrappedReminder.isNew;

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

    self.setTextareaSize = function (element) {
        while (element.outerHeight() < element[0].scrollHeight + parseFloat(element.css("borderTopWidth")) + parseFloat(element.css("borderBottomWidth"))) {
            element.height(element.height() + 1);
        };
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