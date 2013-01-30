/// <reference path="../../_references.js" />
/// <reference path="Friend.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.Profile = function (properties, dataSource) {
        var self = this;

        // Public data properties
        upshot.map(properties, BigShelf.Profile.Type, self);
        upshot.addEntityProperties(self, BigShelf.Profile.Type);
        watchPropertyState(dataSource, self, "Name");
        watchPropertyState(dataSource, self, "EmailAddress");

        // Todo: Why is it necessary to map this manually? Shouldn't upshot.map respect .mapping config?
        self.Friends($.map(properties.Friends, function (f) { return new BigShelf.Friend(f) }));

        self.FirstName = ko.computed(function () {
            var fullName = self.Name() || "";
            return fullName.indexOf(" ") > 0 ? fullName.substring(0, fullName.indexOf(" ")) : fullName;
        });
    }
    BigShelf.Profile.Type = "Profile:#BigShelf.Models";

    // ----------------------------------------------------------------------------
    // At present, Upshot.Compat.Knockout.js doesn't provide an observable API for
    // watching individual property states. The following is a temporary implementation
    // that will be removed once Upshot.Compat.Knockout gains native support for this.
    //
    function watchPropertyState(dataSource, entity, propertyName) {
        // Private: when property or entity changes, update state value
        var property = entity[propertyName];
        var propertyChanged = ko.observable(dataSource.isUpdated(entity, propertyName));
        property.subscribe(function () {
            propertyChanged(dataSource.isUpdated(entity, propertyName));
        });

        // Todo: Remove the following subscription once Upshot #155 is fixed
        entity.EntityState.subscribe(function (state) {
            if (state === upshot.EntityState.Unmodified)
                propertyChanged(false);
        });

        // Public properties & operations
        property.Modified = ko.computed(propertyChanged);
        property.Revert = function () {
            dataSource.revertUpdates(entity, propertyName);
        };
    }
})();