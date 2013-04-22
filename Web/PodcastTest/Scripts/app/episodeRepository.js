(function (window) {

    var episodeManager = new breeze.EntityManager('api/Episode');

    function populateEpisodes(viewModel) {

        var query = breeze.EntityQuery.from("Episodes");

        episodeManager
            .executeQuery(query)
            .then(querySucceeded)
            .fail(queryFailed);

        function querySucceeded(data) {
            //var exportData = episodeManager.exportEntities();
            //window.localStorage.setItem("cache", exportData);

            var episodes = data.results;

            //$.each(episodes, function (index, episode) {
            //    episode.entityAspect.propertyChanged.subscribe(function (changeArgs) {
            //        app.logger.success(changeArgs.propertyName + " changed from " + changeArgs.oldValue + " to " + changeArgs.newValue);
            //window.repository.saveChanges();
            //    });
            //});

            viewModel.episodes(episodes);

            app.logger.success("updated");
        }

        function queryFailed(error) {
            //var offlineEpisodeManager = breeze.EntityManager.importEntities(window.localStorage.getItem("cache"));
            //var results = offlineEpisodeManager.executeQueryLocally(query);
            //viewModel.episodes(results);
            app.logger.success("query failed");
        }
    };

    function saveChanges() {
        if (episodeManager.hasChanges()) {
            episodeManager.saveChanges().then(function (saveResult) {
                app.logger.success("save ok");
                $.connection.notificationHub.server.notifyOthersToUpdate();
            }).fail(function (e) {
                app.logger.success("save failed");
            });


        }
        else {
            app.logger.success("nothing to save");
        }
    }

    // expose a repository interface to the window object
    window.repository = {
        populateEpisodes: populateEpisodes,
        saveChanges: saveChanges
    }

} (window))
