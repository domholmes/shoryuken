(function () {
    var customBindings = {

        invisible: {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                $(element).addClass('invisible-transition');
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = valueAccessor()
                if (value === true) {
                    $(element).addClass('invisible');
                } else {
                    $(element).removeClass('invisible');
                }
            }
        }

    }

    $.extend(ko.bindingHandlers, customBindings);
})();