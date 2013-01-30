/// <reference path="../_references.js" />

(function () {
    var BigShelf = window.BigShelf = window.BigShelf || {};

    BigShelf.GroupedPagingModel = function (dataSource, onPageChangeCallback) {
        // Inherit from upshot.PagingModel
        upshot.PagingModel.call(this, dataSource);

        this.pageGroups = ko.computed(function () {
            // Builds a result like [{ index: 1, groupText: "1-6" }, { index: 2, groupText: "7-12" }, ...]
            var results = [];
            if (this.pageSize() > 0)
                for (var firstOnPage = 1; firstOnPage <= this.totalItems(); firstOnPage += this.pageSize()) {
                    var lastOnPage = Math.min(firstOnPage + this.pageSize() - 1, this.totalItems());
                    results.push({
                        index: Math.ceil(firstOnPage / this.pageSize()),
                        groupText: firstOnPage + "-" + lastOnPage 
                    });
                }
            return results;
        }, this);

        this.selectPageGroup = function (group) {
            onPageChangeCallback(group.index);
        };
    }
})();