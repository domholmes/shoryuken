var sr = window.sr || {};

$(function () {
    sr.vm = new sr.AppViewModel(); // for testing
    ko.applyBindings(sr.vm);
    
    $(".confirm").confirm({
        text: "Disconnecting will remove the association with your Google account and clear all data, are you sure?",
        title: "Disconnect from Squirrel"
    });
});