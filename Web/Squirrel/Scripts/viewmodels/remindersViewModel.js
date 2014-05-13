define(["jquery", "ko"], function ($, ko) {

    return function (reminderRepository, syncNotifier, isSignedInObservable) {

        var repository = reminderRepository;
    
        var syncNotifier = syncNotifier;

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

        var showReminders = ko.computed(function () {

            return isSignedIn();
        });
    
        function loadReminders() {

            isLoadingReminders(true);

            repository.fetchReminders(callback);

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

                var newReminder = repository.createReminder();
            
                newReminder.postCreationSetup();
                newReminder.setDefaults();

                newReminder.inEditMode(true);

                reminders.unshift(newReminder);
            }
        }

        function cancelCurrentAction (reminder) {

            if (reminder.isDeleting()) {

                reminder.isDeleting(false);
            }
            else if (!reminder.isSaving()) {

                var isNew = repository.isNew(reminder);

                if (isNew) {
                    reminders.remove(reminder);
                }
                else {
                    repository.revertReminder(reminder);
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

            repository.saveReminder(

                reminder,
                function () {// success

                    reminder.isSaving(false);

                    if (leaveEditMode) {
                        reminder.inEditMode(false);
                    }

                    syncNotifier.notifyOthers();
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

            repository.deleteReminder(reminder);
            repository.saveReminder(

                reminder,
                function () {// success

                    reminder.inEditMode(false);
                    reminders.remove(reminder);
                    syncNotifier.pushUpdate();
                },
                function (response) {
                    handleSaveFailed(response, reminder);
                });
        }
    
        function handleSaveFailed(response, reminder) {

            reminder.isSaving(false);

            if (response.status) {

                switch (response.status) {

                    case 403:

                        reminder.inEditMode(false);
                        isSignedIn(false);
                        break;

                    default:

                        reminder.errors.push("Save failed, please try again later");
                        break;
                }
            }
        }

        syncNotifier.callback = loadReminders;

        return {
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
            messageOnFocus: messageOnFocus,
            showReminders: showReminders,
            loadReminders: loadReminders
        };        
    }
});