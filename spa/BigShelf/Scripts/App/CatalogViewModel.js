/// <reference path="../_references.js" />
/// <reference path="Entities/Book.js" />
/// <reference path="FlaggedBooksModel.js" />
/// <reference path="GroupedPagingModel.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.CatalogViewModel = function (options) {
        var self = this;
        var pageSize = 6;
        var booksDataSourceParameters = {};
        var booksDataSource = new upshot.RemoteDataSource({
            providerParameters: { url: options.serviceUrl, operationName: "GetBooksForSearch", operationParameters: booksDataSourceParameters },
            mapping: function (data) { return new BigShelf.Book(data, self.flaggedBooks) },
            entityType: BigShelf.Book.Type
        });

        // Public data properties
        self.books = booksDataSource.getEntities();
        self.allFriends = options.friends;
        self.allFriendIds = $.map(self.allFriends, function (f) { return f.FriendId });
        self.chosenFriendIds = ko.observableArray([]);
        self.flaggedBooks = new BigShelf.FlaggedBooksModel({ serviceUrl: options.serviceUrl, profileId: options.profileId });
        self.filterOptions = [{ id: "all", text: "All" }, { id: "mine", text: "My books" }, { id: "friends", text: "Just friends"}];
        self.sortOptions = [{ id: "Title", text: "Title" }, { id: "Author", text: "Author" }, { id: "Rating", text: "Rating" }, { id: "MightRead", text: "Might Read"}];
        self.paging = new BigShelf.GroupedPagingModel(booksDataSource, function (pageIndex) {
            self.nav.navigate({ page: pageIndex });
        });
        self.nav = new NavHistory({
            params: { page: 1, filter: "all", sort: "Title", search: "", friends: "" },
            onNavigate: function (navEntry) {
                self.chosenFriendIds(navEntry.params.friends ? navEntry.params.friends.split(",") : []);
                self.paging.moveTo(Number(navEntry.params.page), pageSize);
                booksDataSourceParameters.sort = navEntry.params.sort;
                booksDataSourceParameters.sortAscending = navEntry.params.sort == "Title" || navEntry.params.sort == "Author";
                booksDataSourceParameters.profileIds = getProfileIdsForQuery();
                booksDataSource.setFilter({ property: "Title", operator: "Contains", value: navEntry.params.search || "" })
                               .refresh();
            }
        });
        self.searchString = ko.computed({
            read: function () { return self.nav.params().search },
            write: function (val) { self.nav.navigate({ search: val, page: 1 }) }
        }).extend({ throttle: 400 }); // Throttle so that we only requery after the user stops typing for 400ms

        function getProfileIdsForQuery() {
            switch (self.nav.params().filter) {
                case "mine": return options.profileId;
                case "friends": return self.nav.params().friends;
                default: return undefined;
            }
        }

        // Public operations
        self.selectFilterOption = function (filterOption) {
            var friendsToSelect = filterOption.id === "friends" ? self.allFriendIds : [];
            self.nav.navigate({ filter: filterOption.id, page: 1, friends: friendsToSelect });
        }
        self.selectSortOption = function (sortOption) {
            self.nav.navigate({ sort: sortOption.id, page: 1 });
        }

        // When underlying filter properties change, trigger the equivalent navigation event
        self.chosenFriendIds.subscribe(function (friendIds) {
            if (friendIds.toString() != self.nav.params().friends)
                self.nav.navigate({ friends: friendIds, page: 1 });
        });

        self.nav.initialize({ linkToUrl: true });
    }
})();