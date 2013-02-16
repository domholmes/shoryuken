// define the viewmodel
var vm = {
    episodes: ko.observableArray(),
<<<<<<< HEAD
    saveChanges: repository.saveChanges,
    refresh: function (episodes) {
        return repository.populateEpisodes(episodes);
    }
}

// bind view to the viewmodel
ko.applyBindings(vm);
=======
    saveChanges: saveChanges,
    refresh: function () {
        return populateEpisodes(this.episodes);
    }
};

// bind view to the viewmodel
ko.applyBindings(vm);
>>>>>>> 9892bc4cc2b86092488bf6d1143bfb5a142dc86d
