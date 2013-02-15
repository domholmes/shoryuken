/// <reference path="..\breeze.debug.js" />

(function (root) {
    var ko = root.ko,
        breeze = root.breeze,
        logger = root.app.logger;

    // define the viewmodel
    var vm = {
        todos: ko.observableArray(),
        episodes: ko.observableArray(),
        includeDone: ko.observable(false),
        save: saveChanges,
        show: ko.observable(false)
    };

    var todoManager = new breeze.EntityManager('api/BreezeSample');
    var episodeManager = new breeze.EntityManager('api/Episode');


    // start fetching Todos
    getTodos();
    getEpisodes();

    // re-query when "includeDone" checkbox changes
    vm.includeDone.subscribe(getEpisodes);

    // bind view to the viewmodel
    ko.applyBindings(vm);

    //#region private functions

    // get Todos asynchronously
    // returning a promise to wait for     
    function getTodos() {

        logger.info("querying Todos");

        var query = breeze.EntityQuery.from("Todos");

        if (!vm.includeDone()) {
            query = query.where("IsDone", "==", false);
        }

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


        if (vm.includeDone()) {

            logger.info("restoring cache from storage and querying Episodes");
            var importData = window.localStorage.getItem("cache");
            episodeManager.importEntities(importData);

            var cachedEpisodes = episodeManager
                .executeQueryLocally(query);

            logger.success("queried Episodes");

            vm.episodes(cachedEpisodes);
        }
        else {

            logger.info("querying Episodes remotely");

            episodeManager
                .executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);
        }

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
    //#endregion

} (window));
