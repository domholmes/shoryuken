/// <reference path="../_references.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.FlaggedBook = function (properties) {
        var self = this;
        upshot.map(properties, BigShelf.FlaggedBook.Type, self);
        upshot.addEntityProperties(self, BigShelf.FlaggedBook.Type);
    }
    BigShelf.FlaggedBook.Type = "FlaggedBook:#BigShelf.Models";

    BigShelf.FlaggedBooksModel = function (options) {
        // Connect to the service and asynchronously fetch all the user's flagged books
        var self = this;
        var flaggedBooksDataSource = new upshot.RemoteDataSource({
            providerParameters: { url: options.serviceUrl, operationName: "GetFlaggedBooksForUser" },
            mapping: BigShelf.FlaggedBook,
            entityType: BigShelf.FlaggedBook.Type
        }).refresh();
        var allFlaggedBooks = flaggedBooksDataSource.getEntities();

        // For fast lookups, maintain an index of FlaggedBooks entities by BookId
        var indexByBookId = ko.computed(function () {
            var result = {};
            $.each(allFlaggedBooks(), function () {
                result[this.BookId()] = this;
            });
            return result;
        });

        self.getFlaggedBookProperty = function (bookId, propertyName, defaultValue) {
            // If the user has no FlaggedBook for this book, return the default
            var indexEntry = indexByBookId()[bookId];
            return indexEntry ? indexEntry[propertyName]() : defaultValue;
        }

        self.setFlaggedBookProperty = function (bookId, propertyName, value) {
            var indexEntry = indexByBookId()[bookId];
            if (indexEntry)
                indexEntry[propertyName](value); // Update the user's existing FlaggedBook for this book
            else {
                // Create a new FlaggedBook for this book
                var properties = { BookId: bookId, ProfileId: options.profileId };
                properties[propertyName] = value;
                allFlaggedBooks.push(new BigShelf.FlaggedBook(properties));
            }
        }

        self.bookIsUpdating = function (bookId) {
            var indexEntry = indexByBookId()[bookId];
            return indexEntry ? indexEntry.EntityState() !== upshot.EntityState.Unmodified : false;
        }
    }
})();