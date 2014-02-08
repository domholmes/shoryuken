window.sr = (function () {
    /* Private
    --------------------------*/

    function appendGpSignInScript() {

        var po = document.createElement('script'), script;

        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';

        script = document.getElementsByTagName('script')[0];
        script.parentNode.insertBefore(po, script);
    }

    /* public
    --------------------------*/
    return {

        init: function (options) {
            var vm = new sr.AppViewModel();

            vm.init(options);

            appendGpSignInScript();

            ko.applyBindings(vm);

            // need a binding for this
            $(".confirm").confirm({
                text: "Disconnecting will remove the association with your Google account and clear all data, are you sure?",
                title: "Disconnect from Squirrel"
            });
        }
    }
})();