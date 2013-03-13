// create an instance of the viewmodel
window.viewModel = new episodesViewModel();

// bind it to the view
ko.applyBindings(viewModel);

// Create a function that the hub can call to broadcast messages.
$.connection.hub.start();

$.connection.notificationHub.client.broadcastEpisodesChangedNotification = function () {
    app.logger.success("requested to update");
    window.viewModel.sync();
};