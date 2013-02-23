test("episodesViewModel Test", function () {

    // Mock
    repository = {
        saveChanges: function () { alert("Changes saved"); },
        populateEpisodes: function (viewModel) { viewModel.episodes = "episodes"; }
    }

    // Act
    var viewModel = new episodesViewModel();

    // Assert
    ok(viewModel.episodes == "episodes", "Passed!");
});