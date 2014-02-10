sr.AppViewModel = function (options) {

    /* Private
    -----------------------------------------*/

    var user = new sr.User(),

        auth = new sr.Authenticator(),

        reminders = ko.observableArray([]),

        isLoadingReminders = ko.observable(false),

        isEditingReminder = ko.computed(function () {

            var reminder = ko.utils.arrayFirst(reminders(), function (reminder) {

                return reminder.inEditMode() === true;
            });

            return reminder !== null;
        }),

        canAddNewReminder = ko.computed(function () {

            return !isEditingReminder();
        });

    function autoSaveReminder (reminder, property, value) {
        property(value);
        saveReminder(reminder, false);
    };

    function manualSaveReminder (reminder) {
        saveReminder(reminder, true);
    };

    function messageOnFocus (reminder) {
        if (!reminder.enabled()) {
            reminder.toggleEnabled();
            saveReminder(reminder);
        }
    };

    function gpSignIn() {
        auth.gpSignIn();
    };

    function attemptDeleteReminder (reminder) {
        if (!reminder.isDeleting()) {
            reminder.isDeleting(true);
        } else {
            deleteReminder(reminder);
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
    

    function createReminder () {

        if (canAddNewReminder()) {

            var newReminder = sr.repository.createReminder();
            newReminder.inEditMode(true);
            newReminder.postCreationSetup();

            reminders.unshift(newReminder);
        }
    }

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

    function startConnection() {

        // SignalR initialisation
        $.connection.hub.start();

        $.connection.hub.disconnected(function () {
            setTimeout(function () {
                $.connection.hub.start();
            }, 20000);
        });

        $.connection.notificationHub.client.update = function () {
            loadReminders();
        };
    }

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
    }
    
    function handleAuthResult(_e, value) {
        user.isAuthenticated(value);

        if (value === true) {
            loadReminders();
            startConnection();
        }
    }


    function init(options) {

        $.subscribe('authentication', handleAuthResult);        

        auth.init(options.gpSignIn);

        $.publish('authentication', options.user.isAuthenticated);
    }

    /* public
    -------------------------------*/

    return {
        init: init,
        user: user,
        reminders: reminders,
        isLoadingReminders: isLoadingReminders,
        isEditingReminder: isEditingReminder,
        canAddNewReminder: canAddNewReminder,
        createReminder: createReminder,
        beginEditReminder: beginEditReminder,
        cancelCurrentAction: cancelCurrentAction,
        attemptDeleteReminder: attemptDeleteReminder,
        autoSaveReminder: autoSaveReminder,
        manualSaveReminder: manualSaveReminder,
        messageOnFocus: messageOnFocus,
        gpSignIn: gpSignIn
    };       
    
}