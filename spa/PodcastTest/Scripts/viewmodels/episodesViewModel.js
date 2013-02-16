// define the viewmodel
var vm = {
    episodes: ko.observableArray(),
    saveChanges: saveChanges,
    refresh: function () {
        return populateEpisodes(this.episodes);
    }
};

// bind view to the viewmodel
ko.applyBindings(vm);
