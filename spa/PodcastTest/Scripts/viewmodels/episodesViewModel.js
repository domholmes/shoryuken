function episodesViewModel() {
    
    this.episodes = ko.observableArray();

    this.sync = function () {
        repository.populateEpisodes(this);
    }

    this.save = function () {
        repository.saveChanges();
    }

    this.episodes.subscribe(function (episodes) {
        ko.utils.arrayForEach(episodes, function (episode) {
            episode.ListenedTo.subscribe(function (episodeListenedTo) {
                app.logger.success("episode listened is " + episodeListenedTo);
                window.repository.saveChanges();
            });
        });
    });

    // perform an initial sync
    this.sync();

    
}


