window.sr = (function () {

    return {

        init: function (options) {

            var auth = new sr.AuthViewModel();
            var reminders = new sr.RemindersViewModel(auth.isSignedIn);
            
            ko.applyBindings(auth, $("#authViewModel")[0]);
            ko.applyBindings(reminders, $("#remindersViewModel")[0]);

            auth.init(options);
            reminders.initialiseViewModel();
            
            reminders.begin();
        }
    }
})();