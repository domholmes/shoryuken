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
            var episodes = data.results;


            $.each(episodes, function (index, episode) {
                episode.entityAspect.propertyChanged.subscribe(function (changeArgs) {
                    app.logger.success(changeArgs.propertyName);
                    app.logger.success(changeArgs.oldValue);
                    app.logger.success(changeArgs.newValue);
                    window.repository.saveChanges();
                });
            });

            viewModel.episodes(episodes);

            app.logger.success("updated from remote and written to storage");
        }

        function queryFailed(error) {
            //var offlineEpisodeManager = breeze.EntityManager.importEntities(window.localStorage.getItem("cache"));
            //var results = offlineEpisodeManager.executeQueryLocally(query);
            //viewModel.episodes(results);
            app.logger.success("query failed");
        }
    };

    function saveChanges() {
        app.logger.success("saveChanges with changes:" + episodeManager.hasChanges());
        setTimeout(episodeManager.saveChanges(), 5000);
    }

    // expose a repository interface to the window object
    window.repository = {
        populateEpisodes: populateEpisodes,
        saveChanges: saveChanges
    }

} (window))
