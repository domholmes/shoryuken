(function (sr) {

    breeze.NamingConvention.camelCase.setAsDefault();
    var episodeManager = new breeze.EntityManager('breeze/reminder');
    

    function createReminder() {

        var newReminder = episodeManager.createEntity('Reminder', sr.reminderDefaults);

        return newReminder;
    };

    function fetchReminders(callback) {

        var query = breeze.EntityQuery.from("reminders");

        episodeManager
            .executeQuery(query)
            .then(function (data) {

                callback(data.results);
            })
            .fail(function (saveResult) {

                //app.logger.success("query failed");
            });
    };

    function deleteReminder(reminder) {

        reminder.entityAspect.setDeleted();
    }

    function revertReminder(reminder) {

        reminder.entityAspect.rejectChanges();
    }

    function isNew(reminder) {

        return reminder.entityAspect.entityState.isAdded();
    }

    function hasErrors(reminder) {

        return reminder.entityAspect.getValidationErrors().length > 0;
    }

    function saveChanges() {

        if (episodeManager.hasChanges()) {

            episodeManager
                .saveChanges()
                .then(function (saveResult) {
                    //app.logger.success("save ok");
                })
                .fail(function (saveResult) {
                    //app.logger.success("save failed");
                });
        }
        else {

            //app.logger.success("nothing to save");
        }
    }

    episodeManager.metadataStore.registerEntityTypeCtor("Reminder", window.reminder, function (entity) {

        entity.fieldsWithErrors = ko.observableArray([]);

        entity.entityAspect.validationErrorsChanged.subscribe(function () {

            entity.fieldsWithErrors.removeAll();

            var errors = entity.entityAspect.getValidationErrors();

            $.each(errors, function () {

                entity.fieldsWithErrors.push(this.propertyName);
            });
        });
    });

    sr.repository = {
        createReminder: createReminder,
        fetchReminders: fetchReminders,
        deleteReminder: deleteReminder,
        revertReminder: revertReminder,
        isNew: isNew,
        hasErrors: hasErrors,
        saveChanges: saveChanges
    }

} (window.sr))