define(['jquery', 'ko', 'dataaccess/reminderRepository', 'viewmodels/authViewModel', 'dataaccess/syncNotifier', 'viewmodels/remindersViewModel', 'view/indexView'],
    function ($, ko, ReminderRepository, AuthViewModel, SyncNotifier, RemindersViewModel) {

        return {
            start: function () {

                var repository = new ReminderRepository();
                var authViewModel = new AuthViewModel();
                var syncNotifier = new SyncNotifier(authViewModel.isSignedIn);
                var remindersViewModel = new RemindersViewModel(repository, syncNotifier, authViewModel.isSignedIn);

                ko.applyBindings(authViewModel, $('#authViewModel')[0]);
                ko.applyBindings(remindersViewModel, $('#remindersViewModel')[0]);

                authViewModel.initialise(options);
                syncNotifier.initialise();
            }
        }
    });