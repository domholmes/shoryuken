/// <reference path="../../_references.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.Book = function (properties, flaggedBooks) {
        var self = this;

        // Public data properties
        upshot.map(properties, BigShelf.Book.Type, self);
        upshot.addEntityProperties(self, BigShelf.Book.Type);

        self.CoverImageUrl = ko.computed(function () {
            return 'http://images.amazon.com/images/P/' + self.ASIN() + '.01.TZZ.jpg';
        });

        self.Rating = ko.computed({
            read: function () { return flaggedBooks.getFlaggedBookProperty(self.Id(), 'Rating', 0) },
            write: function (value) { return flaggedBooks.setFlaggedBookProperty(self.Id(), 'Rating', value) }
        });

        self.IsFlaggedToRead = ko.computed({
            read: function () { return flaggedBooks.getFlaggedBookProperty(self.Id(), 'IsFlaggedToRead', false) },
            write: function (value) { return flaggedBooks.setFlaggedBookProperty(self.Id(), 'IsFlaggedToRead', value) }
        });

        self.CanFlagToRead = ko.computed(function () {
            return (self.Rating() === 0) && !self.IsFlaggedToRead();
        });

        self.StatusText = ko.computed(function () {
            if (self.Rating() > 0) return "Done reading";
            return self.IsFlaggedToRead() ? "Might read it" : "Save";
        });

        self.IsUpdating = ko.computed(function () {
            return flaggedBooks.bookIsUpdating(self.Id());
        });

        // Public operations
        self.flagToRead = function () { self.IsFlaggedToRead(1) }
    }

    BigShelf.Book.Type = "Book:#BigShelf.Models";
})();