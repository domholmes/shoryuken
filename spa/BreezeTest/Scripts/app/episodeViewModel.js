/// <reference path="..\breeze.debug.js" />

(function (root) {
    var ko = root.ko,
            breeze = root.breeze,
            logger = root.app.logger;

    // service name is route to the Web API controller
    var serviceName = 'api/Episode';

    // manager is the service gateway and cache holder
    var manager = new breeze.EntityManager(serviceName);

    // define the viewmodel
    var vm = {
        episodes: ko.observableArray(),
        save: saveChanges,
        show: ko.observable(false)
    };

    // start fetching Todos
    getEpisodes();

    // bind view to the viewmodel
    ko.applyBindings(vm, $("#episodeList")[0]);

    //#region private functions

    // get Todos asynchronously
    // returning a promise to wait for     
    function getEpisodes() {

        logger.info("querying Episodes");

        var query = breeze.EntityQuery.from("Episodes");

        return manager
            .executeQuery(query)
            .then(querySucceeded)
            .fail(queryFailed);

        // reload vm.todos with the results 
        function querySucceeded(data) {
            logger.success("queried Episodes");
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