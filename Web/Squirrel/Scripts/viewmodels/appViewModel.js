var sr = sr || {};

sr.AppViewModel = function () {
    var vm = this,
        reminders;

    // Data
    vm.reminders = ko.observableArray([]);
    vm.reminderGroups = ko.observableArray([]);

    vm.editing = ko.computed(function () {
        var reminder = ko.utils.arrayFirst(vm.reminders(), function (reminder) {
            return reminder.editing() === true;
        });

        return reminder !== null;
    });

    vm.belowThreshold = ko.observable();

    // Operations
    vm.createReminder = function () {
        if (vm.editing() === false) {
            var reminder = new sr.Reminder();

            reminder.isNew(true);
            reminder.editing(true);
            vm.reminders.unshift(reminder);

            vm.groupReminders();

            $('.timepicker').timepicker({ showMeridian: false });
            $("textarea").keyup(function (e) {
                vm.setTextareaSize($(this));
            });            

            $('.card:first').find('.edit')
                .css({
                    opacity: 0,
                    overflow: 'hidden'
                })
                .animate({ opacity: 1 }, 300, function () {
                    $(this).css({ overflow: 'visible' });
                });
        }
    };

    vm.editReminder = function (reminder, event) {
        var card = $(event.target).closest('.card'),
            edit = card.find('.edit'),
            display = card.find('.display'),
            eventualSize;

        card.height(card.height());
        display.animate({ opacity: 0 }, 300);

        vm.cachedReminder = ko.toJS(reminder);
        $('.timepicker').timepicker({ showMeridian: false });

        $("textarea").keyup(function (e) {
            vm.setTextareaSize($(this));
        });

        reminder.editing(true);

        vm.setTextareaSize($("textarea"));

        eventualSize = card.find('.edit').height();
        card.addClass('editing');
        card.animate({ height: eventualSize + 'px' }, 300, function () {
            card.css('height', 'auto');
        });

        edit.animate({ opacity: 1 }, 300);
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

        vm.groupReminders();
    };

    vm.endEdit = function (reminder, event) {
        var card = $(event.target).closest('.card'),
            edit = card.find('.edit'),
            display = card.find('.display'),
            eventualSize;

        vm.saveReminder(reminder);

        card.height(card.height());
        edit.animate({ opacity: 0 }, 300);

        reminder.editing(false);

        eventualSize = card.find('.display').height();
        card.removeClass('editing');
        card.animate({ height: eventualSize + 'px' }, 300, function () {
            card.css('height', 'auto');
        });

        display.animate({ opacity: 1 }, 300);

        reminder.isNew(false);
    };

    vm.cancelEdit = function (reminder, event) {
        var card = $(event.target).closest('.card'),
            edit = card.find('.edit'),
            display = card.find('.display'),
            eventualSize;

        card.height(card.height());
        edit.animate({ opacity: 0 }, 300);

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

        eventualSize = card.find('.display').height();
        card.removeClass('editing');
        card.animate({ height: eventualSize + 'px' }, 300, function () {
            card.css('height', 'auto');
        });

        display.animate({ opacity: 1 }, 300);
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

    vm.setTextareaSize = function (elements) {
        elements.each(function (index, el) {
            var element = $(el);
            while (element.outerHeight() < element[0].scrollHeight + parseFloat(element.css("borderTopWidth")) + parseFloat(element.css("borderBottomWidth"))) {
                element.height(element.height() + 1);
            };
        });
    };

    vm.groupReminders = function () {
        var groups = [],
            reminders = vm.reminders();

        vm.belowThreshold($(window).width() < 800);

        if (vm.belowThreshold()) {
            for (var i = 0; i < reminders.length; i += 2) {
                groups.push(reminders.slice(i, i + 2));
            }
        }
        else {
            for (var i = 0; i < reminders.length; i += 4) {
                groups.push(reminders.slice(i, i + 4));
            }
        }
        vm.reminderGroups(groups);
    };

    vm.init = function () {

        $(window).resize(function () {
            vm.groupReminders();
        });

        // Perform initial load
        $.getJSON("api/reminder/get", function (allData) {
            var mappedReminders = $.map(allData, function (item) { return new sr.Reminder(item) });
            vm.reminders(mappedReminders);
            vm.groupReminders();
        });
    };

    vm.init();
}