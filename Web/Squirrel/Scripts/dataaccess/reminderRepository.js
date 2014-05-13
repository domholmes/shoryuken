define(["Q", "breeze", "ko", "models/reminder"], function (Q, breeze, ko, Reminder) {

    return function () {

        breeze.NamingConvention.camelCase.setAsDefault();
        var episodeManager = new breeze.EntityManager('breeze/reminder');

        function createReminder() {

            var newReminder = episodeManager.createEntity('Reminder');

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
                    console.dir(saveResult); // TODO: do something meaningful here instead
                });
        };

        function deleteReminder(reminder, successCallback, failCallback) {

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

        function saveReminder(reminder, successCallback, failCallback) {

            reminder.propertiesWithErrors.removeAll();
            reminder.errors.removeAll();

            episodeManager
                .saveChanges([reminder])
                .then(successCallback)
                .fail(failCallback);
        }

        breeze.config.getAdapterInstance("ajax").defaultSettings = { cache: false };

        var valOpts = episodeManager.validationOptions.using({ validateOnAttach: false });
        episodeManager.setProperties({ validationOptions: valOpts });

        episodeManager.metadataStore.registerEntityTypeCtor("Reminder", Reminder, function (entity) {

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

        return {
            createReminder: createReminder,
            fetchReminders: fetchReminders,
            deleteReminder: deleteReminder,
            revertReminder: revertReminder,
            saveReminder: saveReminder,
            isNew: isNew
        }

    }
}
);