window.sr = (function () {

    return {

        init: function (options) {
            var app = new sr.AppViewModel();                

            app.initialiseViewModel(options);          

            ko.applyBindings(app);            
        }
    }
})();