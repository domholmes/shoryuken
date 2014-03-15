window.sr = (function () {

    return {

        init: function (options) {

            var repository = new sr.ReminderRepository();
            var authViewModel = new sr.AuthViewModel();
            var remindersViewModel = new sr.RemindersViewModel(repository, authViewModel.isSignedIn);
            
            ko.applyBindings(authViewModel, $("#authViewModel")[0]);
            ko.applyBindings(remindersViewModel, $("#remindersViewModel")[0]);

            remindersViewModel.initialise();
            authViewModel.initialise(options);
        }
    }
})();