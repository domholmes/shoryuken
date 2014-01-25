sr.AppViewModel = function (options) {

    /* Private
    -----------------------------------------*/

    var vm = this,
        gpSignInParams;   

    function loadReminders() {

        vm.isLoadingReminders(true);

        sr.repository.fetchReminders(callback);

        function callback(data) {

            vm.isLoadingReminders(false);

            ko.utils.arrayForEach(data, function (reminder) {
                reminder.postCreationSetup();
            });

            vm.reminders(data);
        }
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
    }

    function signInCallback(authResult) {

        if (authResult.status.signed_in === false) {

            // make sure button is not display:none and fade in if opacity 0
            $('.signin-button').show().animate({ opacity: 1 }, 200);

            return;
        }

        $('.signin-button').animate({ opacity: 0 }, 200, function () {
            var code = authResult['code'];

            // give .signin-button display:none, in effect removing it
            $(this).hide();

            if (code) {

                // make sure signing in message is not display:none and fade in if opacity 0
                $('.authenticating').show().animate({ opacity: 1 }, 200, function () {

                    // make the call to the server to validate the google token and sign user in
                    $.ajax({
                        type: 'POST',
                        url: '/Account/Callback',
                        data: { code: code }
                    })

                    .then(
                        function (result) {

                            // success

                            // fade out signing in message
                            $('.authenticating').animate({ opacity: 0 }, 200, function () {

                                // completely hide invisible signing in message
                                $(this).hide();

                                // notify our viewmodel that the user is now authenticated
                                vm.user.isAuthenticated(true);

                            });
                        },

                        function (result) {

                            // fail

                            // fade out signing in message
                            $('.authenticating').animate({ opacity: 0 }, 200, function () {

                                // completely hide invisible signing in message
                                $(this).hide();

                                // fade in failed message if opacity 0
                                $('.signin-failed').animate({ opacity: 1 }, 200, function () {

                                    // pause on failed message for 3 seconds
                                    setTimeout(function () {

                                        // fade out failed message
                                        $('.signin-failed').animate({ opacity: 0 }, 200, function () {

                                            // fade the sign in button back in
                                            $('.signin-button').show().animate({ opacity: 1 }, 200, function () {

                                            });
                                        });
                                    }, 3000);
                                });
                            });
                        }
                    );
                });

            } else if (authResult['error']) {

                // There was an error.
                // Possible error codes:
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatially log in the user
                // console.log('There was an error: ' + authResult['error']);
            }
        });
    }

    /* public
    -------------------------------*/

    vm.init = function (options) {

        // although this client_id param exists in gpSignInParams Google ignores it
        // it seems google will only take it from this meta tag
        $('<meta name="google-signin-clientid" content="' + options.gpSignInParams.client_id + '" />').prependTo(document.head);

        gpSignInParams = $.extend({
            callback: signInCallback,
            requestvisibleactions: "http://schemas.google.com/AddActivity",
            cookiepolicy: "single_host_origin"
        }, options.gpSignInParams);

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

        vm.user.isAuthenticated(options.user.isAuthenticated);
    };

    vm.user = {
        isAuthenticated: ko.observable(false)
    };

    vm.isAuthenticating = ko.observable(false);

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
            deleteReminder(reminder);
        }
    };    
    
    vm.autoSaveReminder = function (reminder, property, value) {
        property(value);
        saveReminder(reminder, false);
    };

    vm.manualSaveReminder = function (reminder) {
        saveReminder(reminder, true);
    };

    vm.messageOnFocus = function (reminder) {
        if (!reminder.enabled()) {
            reminder.toggleEnabled();
            saveReminder(reminder);
        }
    };

    vm.gpSignIn = function () {
        gapi.auth.signIn(gpSignInParams);
    };

    vm.user.isAuthenticated.subscribe(function (value) {
        if (value === true) {
            loadReminders();
        }
    });        
}