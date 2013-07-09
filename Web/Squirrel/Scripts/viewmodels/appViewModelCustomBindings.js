ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor, allBindingsAccessor) {

        // Next, whether or not the supplied model property is observable, get its current value
        ko.utils.unwrapObservable(valueAccessor());

        // Grab some more data from another binding property
        var duration = allBindingsAccessor().slideDuration || 400; // 400ms is default duration unless otherwise specified

        // Now manipulate the DOM element
        if (valueAccessor() == true)
            $(element).slideDown(duration); // Make the element visible
        else
            $(element).hide();   // Make the element invisible
    }
};