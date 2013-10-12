(function (sr) {

    // EntityManager configuration
    breeze.NamingConvention.camelCase.setAsDefault();
    var episodeManager = new breeze.EntityManager('breeze/reminder');

    var valOpts = episodeManager.validationOptions.using({ validateOnAttach: false });
    episodeManager.setProperties({ validationOptions: valOpts });

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
                console.dir(saveResult);
            });
    };

    function deleteReminder(reminder) {

        reminder.entityAspect.setDeleted();
    }

    function revertReminder(reminder) {

        reminder.propertiesWithErrors.removeAll();
        reminder.errors.removeAll();

        reminder.entityAspect.rejectChanges();
    }

    function isNew(reminder) {

        return reminder.entityAspect.entityState.isAdded();
    }

    function hasErrors(reminder) {

        return reminder.entityAspect.getValidationErrors().length > 0;
    }

    function saveReminder(reminder, successCallback, failCallback) {

        reminder.propertiesWithErrors.removeAll();
        reminder.errors.removeAll();

        episodeManager
            .saveChanges([reminder])
            .then(successCallback)
            .fail(failCallback);
    }

    episodeManager.metadataStore.registerEntityTypeCtor("Reminder", sr.Reminder, function (entity) {

        entity.propertiesWithErrors = ko.observableArray([]);
        entity.errors = ko.observableArray([]);

        entity.entityAspect.validationErrorsChanged.subscribe(function () {

            entity.propertiesWithErrors.removeAll();
            entity.errors.removeAll();

            var errors = entity.entityAspect.getValidationErrors();

            $.each(errors, function () {

                entity.errors.push(this.errorMessage);

                if (typeof this.propertyName != 'undefined') {

                    entity.propertiesWithErrors.push(this.propertyName);
                }
            });
        });
    });

    sr.repository = {
        createReminder: createReminder,
        fetchReminders: fetchReminders,
        deleteReminder: deleteReminder,
        revertReminder: revertReminder,
        saveReminder: saveReminder,
        isNew: isNew,
        hasErrors: hasErrors
    }

} (window.sr))