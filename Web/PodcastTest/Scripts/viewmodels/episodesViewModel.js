function episodesViewModel() {
    
    this.episodes = ko.observableArray();

    this.sync = function () {
        repository.populateEpisodes(this);
    }

    this.save = function () {
        repository.saveChanges();
    }

    // perform an initial sync
    this.sync();   
}


