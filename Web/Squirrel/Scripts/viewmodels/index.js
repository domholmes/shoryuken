var sr = sr || {};

sr.AppViewModel = function () {
    
    var vm = this,
        reminders;

    vm.reminders = ko.observableArray([]);

    vm.editing = ko.computed(function () {
        
        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {
            
            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    vm.createReminder = function () {

        if (vm.editing() === false) {

            var reminder = new sr.Reminder();

            reminder.isNew(true);
            reminder.editing(true);
            vm.reminders.unshift(reminder);
        }
    };

    vm.editReminder = function (reminder, event) {

        vm.cachedReminder = ko.toJS(reminder);

        reminder.editing(true);
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

    vm.saveReminder = function (reminder, event) {

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

        reminder.editing(false);

        reminder.isNew(false);
    }; 
    
    vm.enableReminder = function (reminder) {
        reminder.enabled(!reminder.enabled());
    };

    vm.cancelEdit = function (reminder, event) {
        
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
            reminder.enabled(vm.cachedReminder.enabled);
        }
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