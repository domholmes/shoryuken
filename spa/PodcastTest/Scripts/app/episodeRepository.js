(function (window) {

    var episodeManager = new breeze.EntityManager('api/Episode');

    function populateEpisodes(viewModel) {

        var query = breeze.EntityQuery.from("Episodes");

        app.logger.info("querying Episodes remotely");

        episodeManager
        .executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

        function querySucceeded(data) {
            app.logger.success("queried Episodes");
            var exportData = episodeManager.exportEntities();
            window.localStorage.setItem("cache", exportData);
            app.logger.success("written to storage");
            viewModel.episodes(data.results);
            app.logger.success("viewmodel updated");
        }

        function queryFailed(error) {
            app.logger.error("Query failed, will attempt to retrieve from cache: " + error.message);
            var data = episodeManager.executeQueryLocally(query);
            viewModel.episodes(data.results);
        }
    };

    function saveChanges() {
        return episodeManager.saveChanges()
        .then(function () { app.logger.success("changes saved"); })
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
