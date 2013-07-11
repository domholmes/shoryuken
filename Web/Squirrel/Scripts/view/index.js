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

ko.bindingHandlers.foreachGroups = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var groupedItems,
             data = valueAccessor(),
             getGroupCount = function () {
                 if ($(window).width() < 800) {
                     return 2;
                 } else {
                     return 4;
                 }
             },
             count = ko.observable(getGroupCount());

        ko.utils.registerEventHandler(window, "resize", function () {
            //run your calculation logic here and update the "count" observable with a new value
            count(getGroupCount());
        });

        //create our own computed that transforms the flat array into rows/columns
        groupedItems = ko.computed({
            read: function () {
                var index, length, group,
                    result = [],
                    itemsPerRow = ko.utils.unwrapObservable(count) || 1,
                    items = ko.utils.unwrapObservable(data);

                //create an array of arrays (rows/columns)
                for (index = 0, length = items.length; index < length; index++) {
                    if (index % itemsPerRow === 0) {
                        group = [];
                        group.spanClass = count() === 2 ? "span6" : "span3";
                        result.push(group);
                    }

                    group.push(items[index]);
                }

                return result;
            },
            disposeWhenNodeIsRemoved: element
        });

        //use the normal foreach binding with our new computed
        ko.applyBindingsToNode(element, { foreach: groupedItems }, viewModel);

        //make sure that the children of this element are not bound
        return { controlsDescendantBindings: true };
    }
};

//this.grouped = ko.computed(function () {

//    var reminders = this.sr.reminders();
//    var rows = [], current = [];
//    rows.push(current);
//    for (var i = 0; i < reminders.length; i += 1) {
//        current.push(reminders[i]);
//        if (((i + 1) % 4) === 0) {
//            current = [];
//            rows.push(current);
//        }
//    }
//    return rows;
//}, this);