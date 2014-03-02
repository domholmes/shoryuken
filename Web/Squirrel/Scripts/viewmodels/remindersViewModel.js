sr.RemindersViewModel = function (isSignedInObservable) {

    var isSignedIn = isSignedInObservable;

    var reminders = ko.observableArray([]);

    var isLoadingReminders = ko.observable(false);

    var isEditingReminder = ko.computed(function () {

        var reminder = ko.utils.arrayFirst(reminders(), function (reminder) {

            return reminder.inEditMode() === true;
        });

        return reminder !== null;
    });

    var showAddNewReminder = ko.computed(function () {

        return isSignedIn();
    });

    var canAddNewReminder = ko.computed(function () {

        return !isEditingReminder();
    });
    
    function loadReminders() {

        isLoadingReminders(true);

        sr.repository.fetchReminders(callback);

        function callback(data) {

            isLoadingReminders(false);

            ko.utils.arrayForEach(data, function (reminder) {
                reminder.postCreationSetup();
            });

            reminders(data);
        }
    }

    function createReminder() {

        if (canAddNewReminder()) {

            var newReminder = sr.repository.createReminder();
            newReminder.inEditMode(true);
            newReminder.postCreationSetup();

            reminders.unshift(newReminder);
        }
    }

    function cancelCurrentAction (reminder) {

        if (reminder.isDeleting()) {

            reminder.isDeleting(false);
        }
        else if (!reminder.isSaving()) {

            var isNew = sr.repository.isNew(reminder);

            if (isNew) {
                reminders.remove(reminder);
            }
            else {
                sr.repository.revertReminder(reminder);
                reminder.isSaving(false);
                reminder.inEditMode(false);
            }
        }
    }

    function beginEditReminder (reminder, event) {

        event.stopPropagation();
        reminder.inEditMode(true);
    }

    function messageOnFocus(reminder) {

        if (!reminder.enabled()) {
            reminder.toggleEnabled();
            saveReminder(reminder);
        }
    };

    function autoSaveReminder(reminder, property, value) {

        if (value !== '') {
            property(value);
            saveReminder(reminder, false);
        }
    };

    function manualSaveReminder(reminder) {

        saveReminder(reminder, true);
    };

    function saveReminder(reminder, leaveEditMode) {

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
            function (response) {
                handleSaveFailed(response, reminder);
            });
    }

    function attemptDeleteReminder(reminder) {

        if (!reminder.isDeleting()) {

            reminder.isDeleting(true);
        } else {

            deleteReminder(reminder);
        }
    }

    function deleteReminder(reminder) {

        sr.repository.deleteReminder(reminder);
        sr.repository.saveReminder(

            reminder,
            function () {// success

                reminder.inEditMode(false);
                reminders.remove(reminder);
                $.connection.notificationHub.server.pushUpdate();
            },
            function (response) {
                handleSaveFailed(response, reminder);
            });
    }
    
    function handleSaveFailed(response, reminder) {

        if (response.status) {

            switch (response.status) {

                case 403:

                    reminder.isSaving(false);
                    reminder.inEditMode(false);
                    isSignedIn(false);
                    break;

                default:

                    reminder.errors.push("Save failed, please try again later");
                    break;
            }
        }
    }

    function isSignedInChange() {

        if (isSignedIn()) {
            loadReminders();
            $.connection.hub.start();
        }
        else {
            reminders.removeAll();
            $.connection.hub.stop();
        }
    }
    
    function initialiseViewModel() {

        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                if (isSignedIn()) {
                    $.connection.hub.start();
                }
            }, 20000);
        });

        $.connection.notificationHub.client.update = function () {
            loadReminders();
        };

        isSignedIn.subscribe(isSignedInChange);
    }

    return {
        initialiseViewModel: initialiseViewModel,
        reminders: reminders,
        isLoadingReminders: isLoadingReminders,
        isEditingReminder: isEditingReminder,
        showAddNewReminder: showAddNewReminder,
        canAddNewReminder: canAddNewReminder,
        createReminder: createReminder,
        beginEditReminder: beginEditReminder,
        cancelCurrentAction: cancelCurrentAction,
        attemptDeleteReminder: attemptDeleteReminder,
        autoSaveReminder: autoSaveReminder,
        manualSaveReminder: manualSaveReminder,
        messageOnFocus: messageOnFocus
    };       
    
}