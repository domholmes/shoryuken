var sr = window.sr || {};

$(function () {
    sr.vm = new sr.AppViewModel(); // for testing
    ko.applyBindings(sr.vm);
});

ko.bindingHandlers.invisible = {
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
};