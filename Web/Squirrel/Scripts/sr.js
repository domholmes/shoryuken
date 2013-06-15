var sr = window.sr || {};

$(function () {
    sr.vm = new sr.AppViewModel(); // for testing
    ko.applyBindings(sr.vm);
});