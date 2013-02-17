// define the viewmodel
function episodesViewModel() {
    this.episodes = ko.observableArray();
    this.saveChanges = repository.saveChanges;
    this.refresh = function () {
        repository.populateEpisodes(this);
    }
    this.refresh();
}

// create a viewmodel and bind it to the view
ko.applyBindings(new episodesViewModel());

