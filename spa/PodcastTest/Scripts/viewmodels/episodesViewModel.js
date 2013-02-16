// define the viewmodel
var vm = {
    episodes: ko.observableArray(),
    saveChanges: repository.saveChanges,
    refresh: function (episodes) {
        return repository.populateEpisodes(episodes);
    }
}

// bind view to the viewmodel
ko.applyBindings(vm);
