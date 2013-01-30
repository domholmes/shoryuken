/// <reference path="../../_references.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.Friend = function (properties) {
        var self = this;
        upshot.map(properties, BigShelf.Friend.Type, self);
        upshot.addEntityProperties(self, BigShelf.Friend.Type);

        self.IsAdded = ko.computed(function () {
            return self.EntityState() === upshot.EntityState.ClientAdded;
        });

        self.IsDeleted = ko.computed(function () {
            return self.EntityState() === upshot.EntityState.ClientDeleted
                || self.EntityState() === upshot.EntityState.ServerDeleting;
        });
    }

    BigShelf.Friend.Type = "Friend:#BigShelf.Models";
})();