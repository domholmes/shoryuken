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
                //kept empty to insert debug breakpoint
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

    function saveReminder(reminder, successCallback) {

        episodeManager
            .saveChanges([reminder])
            .then(successCallback)
            .fail(function (saveResult) {
                //kept empty to insert debug breakpoint
            });
    }

    episodeManager.metadataStore.registerEntityTypeCtor("Reminder", sr.Reminder, function (entity) {

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
        saveReminder: saveReminder,
        isNew: isNew,
        hasErrors: hasErrors
    }

} (window.sr))