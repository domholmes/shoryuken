(function (window) {

    var episodeManager = new breeze.EntityManager('api/Episode');

    function populateEpisodes(viewModel) {

        var query = breeze.EntityQuery.from("Episodes");

        episodeManager
            .executeQuery(query)
            .then(querySucceeded)
            .fail(queryFailed);

        function querySucceeded(data) {
            var exportData = episodeManager.exportEntities();
            window.localStorage.setItem("cache", exportData);
            viewModel.episodes(data.results);
            app.logger.success("updated from remote and written to storage");
        }

        function queryFailed(error) {
            var offlineEpisodeManager = breeze.EntityManager.importEntities(window.localStorage.getItem("cache"));
            var results = offlineEpisodeManager.executeQueryLocally(query);
            viewModel.episodes(results);
            app.logger.success("updated from local cache");
        }
    };

    function saveChanges() {
        return episodeManager.saveChanges()
        .then(function () { app.logger.success("saveChanges called"); })
        .fail(saveFailed);
    }

    function saveFailed(error) {
        app.logger.error("Save failed: " + error.message);
    }

    // expose a repository interface to the window object
    window.repository = {
        populateEpisodes: populateEpisodes,
        saveChanges: saveChanges
    }

} (window))
