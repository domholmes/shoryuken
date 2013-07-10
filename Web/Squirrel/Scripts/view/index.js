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

this.grouped = ko.computed(function () {

    var reminders = this.sr.reminders();
    var rows = [], current = [];
    rows.push(current);
    for (var i = 0; i < reminders.length; i += 1) {
        current.push(reminders[i]);
        if (((i + 1) % 4) === 0) {
            current = [];
            rows.push(current);
        }
    }
    return rows;
}, this);