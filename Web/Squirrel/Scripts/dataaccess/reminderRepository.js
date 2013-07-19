(function (window) {

    breeze.NamingConvention.camelCase.setAsDefault();
    var episodeManager = new breeze.EntityManager('breeze/reminder');
    
    function fetchReminders(callback) {

        var query = breeze.EntityQuery.from("reminders");

        episodeManager
            .executeQuery(query)
            .then(function (data) {

                callback(data.results); 
             })
            .fail(function (saveResult) {

                app.logger.success("query failed"); 
            });
    };

    function saveChanges() {

        if (episodeManager.hasChanges()) {

            episodeManager
                .saveChanges()
                .then(function (saveResult) { app.logger.success("save ok"); })
                .fail(function (saveResult) { app.logger.success("save failed"); });
        }
        else {

            app.logger.success("nothing to save");
        }
    }

    function addAdditionalProperties(ctor) {

        episodeManager.metadataStore.registerEntityTypeCtor("Reminder", ctor);    
    }

    window.repository = {
        fetchReminders: fetchReminders,
        saveChanges: saveChanges,
        addAdditionalProperties: addAdditionalProperties
    }

} (window))