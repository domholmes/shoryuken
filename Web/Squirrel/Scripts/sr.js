window.sr = (function () {

    return {

        init: function (options) {
            var app = new sr.AppViewModel();                

            app.init(options);          

            ko.applyBindings(app);            
        }
    }
})();