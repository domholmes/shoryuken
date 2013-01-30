/// <reference path="../_references.js" />

ko.bindingHandlers.starRating = {
    init: function (element, valueAccessor) {
        // Add a star for each possible rating
        $.each([1, 2, 3, 4, 5], function () {
            var index = this;
            $("<span>")
                .addClass("star")
                .click(function () {
                    // Handle clicks by updating the bound observable
                    valueAccessor()(index);
                }).appendTo(element);
        });
    },
    update: function (element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor();
        $("span", element).each(function (index) {
            $(this).toggleClass("chosen", index < observable());
        });
    }
};

// Attaches a jQuery UI "autocomplete" to a DOM element, with suggestions to
// be supplied by a callback function on your viewmodel
ko.bindingHandlers.autocomplete = {
    init: function (element, valueAccessor) {
        var options = valueAccessor(),
            dataCallback = options.source;

        $(element).autocomplete({
            source: function (req, res) { dataCallback(req.term, res) },
            select: function (event, ui) {
                options.select(ui.item.data || ui.item.value || ui.item);
                event.preventDefault();
                $(element).val("");
            }
        });
    }
};