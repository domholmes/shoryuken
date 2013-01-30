/// <reference path="../_references.js" />
/// <reference path="Entities/Profile.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.ProfileEditorViewModel = function (options) {
        var self = this;

        // Data sources
        var profileDataSource = new upshot.RemoteDataSource({
            providerParameters: { url: options.serviceUrl, operationName: "GetProfileForProfileUpdate" },
            mapping: function (properties) { return new BigShelf.Profile(properties, profileDataSource) },
            entityType: BigShelf.Profile.Type,
            bufferChanges: true
        }).refresh();
        var possibleFriendsDataSource = new upshot.RemoteDataSource({
            providerParameters: { url: options.serviceUrl, operationName: "GetProfiles" },
            entityType: BigShelf.Profile.Type
        });

        // Public data properties
        self.profile = profileDataSource.getFirstEntity();
        self.friendsModified = collectionIsModified(self.profile, "Friends");
        self.allowSave = ko.computed(function () {
            return (self.profile() && self.profile().EntityState() !== upshot.EntityState.Unmodified || self.friendsModified());
        });

        // Public operations
        self.save = function () { profileDataSource.commitChanges() }
        self.revert = function () {
            profileDataSource.revertChanges();
            upshot.EntitySource.as(self.profile().Friends).revertChanges();
        }

        self.findFriends = function (search, callback) {
            // Asynchronously supplies a list of autocomplete suggestions
            possibleFriendsDataSource.setFilter([
                { property: "Name", operator: "Contains", value: search },
                { property: "Id", operator: "!=", value: self.profile().Id() }
            ]).refresh(function (profiles) {
                // Map the array of profile entities to an array of "Name" strings
                callback($.map(profiles, function (p) { return { label: p.Name(), data: p } }));
            });
        }

        self.addFriend = function (friend) {
            // Attach the raw friend data as a new entity in profileDataSource, to avoid having to reload it from the server
            var newFriendProfile = profileDataSource.getDataContext().merge([
                { Id: friend.Id(), Name: friend.Name() }
            ], BigShelf.Profile.Type)[0];

            // Search self.profile().Friends to check that they are not already a friend
            var isAlreadyFriends = ko.utils.arrayFirst(self.profile().Friends(), function (existingFriend) {
                return existingFriend.FriendProfile() === newFriendProfile;
            });
            if (!isAlreadyFriends) {
                var newFriend = new BigShelf.Friend({ FriendId: friend.Id() });
                self.profile().Friends.push(newFriend);
            }
        }

        self.toggleFriend = function (friend) {
            var friendsDataSource = upshot.EntitySource.as(self.profile().Friends);
            if (friend.EntityState() === upshot.EntityState.Unmodified)
                friendsDataSource.deleteEntity(friend);
            else
                friendsDataSource.revertChanges(friend);
        }
    }

    // Scary-looking workaround for Upshot issue #180 - currently there isn't a reasonable way to find out whether
    // any item in a child collection was modified. All the following code will be removed once #180 is fixed.
    function collectionIsModified(container, collectionName) {
        var result = ko.observable(false);
        setTimeout(function () {
            ko.computed(function () {
                var containerValue = ko.utils.unwrapObservable(container);
                if (containerValue) {
                    var items = containerValue[collectionName]();
                    var modifiedItems = ko.utils.arrayFilter(items, function (item) {
                        return item.EntityState() !== upshot.EntityState.Unmodified
                    });
                    result(modifiedItems.length > 0);
                }
            });
        }, 0);
        return ko.computed(result);
    }
})();