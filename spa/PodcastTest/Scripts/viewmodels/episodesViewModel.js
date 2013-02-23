function episodesViewModel() {
    
    this.episodes = ko.observableArray();

    this.sync = function () {
        repository.saveChanges();
        repository.populateEpisodes(this);
    }

    // perform an initial sync
    this.sync();

    // add a timer to the window to sync ever 5 seconds
    //window.setInterval(window.viewModel.sync, 5000);
}


