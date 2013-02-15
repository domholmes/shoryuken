
/// <reference path="..\breeze.debug.js" />

(function (root) {
    var ko = root.ko,
        breeze = root.breeze,
        logger = root.app.logger;

    // define the viewmodel
    var vm = {
        episodes: ko.observableArray(),
        };

    var episodeManager = new breeze.EntityManager('api/Episode');

    // start fetching Todos
    getEpisodes();

    // re-query when "includeDone" checkbox changes
    //vm.includeDone.subscribe(getEpisodes);

    // bind view to the viewmodel
    ko.applyBindings(vm);

    // get Todos asynchronously
    // returning a promise to wait for     
    function getTodos() {

        logger.info("querying Todos");

        var query = breeze.EntityQuery.from("Todos");

        return todoManager
            .executeQuery(query)
            .then(querySucceeded)
            .fail(queryFailed);

        // reload vm.todos with the results 
        function querySucceeded(data) {
            logger.success("queried Todos");
            vm.todos(data.results);
            vm.show(true); // show the view
        }
    };

    function getEpisodes() {

        var query = breeze.EntityQuery.from("Episodes");

        logger.info("querying Episodes remotely");

        episodeManager
            .executeQuery(query)
            .then(querySucceeded)
            .fail(queryFailed);

        // reload vm.todos with the results 
        function querySucceeded(data) {
            logger.success("queried Episodes, writing to storage");
            var exportData = episodeManager.exportEntities();
            window.localStorage.setItem("cache", exportData);
            vm.episodes(data.results);
            vm.show(true); // show the view
        }
    };

    function queryFailed(error) {
        logger.error("Query failed: " + error.message);
    }

    function saveChanges() {
        return manager.saveChanges()
            .then(function () { logger.success("changes saved"); })
            .fail(saveFailed);
    }

    function saveFailed(error) {
        logger.error("Save failed: " + error.message);
    }

    function clearLocalStorage() {
        window.localStorage.clear();
    }
    //#endregion

} (window));
