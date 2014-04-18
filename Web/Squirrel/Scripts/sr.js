window.sr = (function () {

    return {

        init: function (options) {

            var repository = new sr.ReminderRepository();
            var authViewModel = new sr.AuthViewModel();
            var syncNotifier = new sr.SyncNotifier(authViewModel.isSignedIn);
            var remindersViewModel = new sr.RemindersViewModel(repository, syncNotifier, authViewModel.isSignedIn);
            
            ko.applyBindings(authViewModel, $("#authViewModel")[0]);
            ko.applyBindings(remindersViewModel, $("#remindersViewModel")[0]);

            authViewModel.initialise(options);
            syncNotifier.initialise();
        }
    }
})();