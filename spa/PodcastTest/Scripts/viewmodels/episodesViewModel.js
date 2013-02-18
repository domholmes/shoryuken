// define the viewmodel
function episodesViewModel() {
    
    this.episodes = ko.observableArray();

    this.sync = function () {
        repository.saveChanges();
        repository.populateEpisodes(window.viewModel);
    }

    window.setInterval(this.sync, 5000);
}

// create a viewmocel
window.viewModel = new episodesViewModel();

// bind it to the view
ko.applyBindings(viewModel);

// perform an initial local sync
window.viewModel.sync();

