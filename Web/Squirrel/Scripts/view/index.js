ko.bindingHandlers.expandingTextbox = {

    // not finished

    setTextareaSize: function (elements) {
        elements.each(function (index, el) {
            var element = $(el);
            while (element.outerHeight() < element[0].scrollHeight + parseFloat(element.css("borderTopWidth")) + parseFloat(element.css("borderBottomWidth"))) {
                element.height(element.height() + 1);
            };
        });
    },

    init: function (element) {
        var element = $(element),
            self = ko.bindingHandlers.expandingTextbox;

        self.setTextareaSize(element);

        element.keyup(function (e) {
            self.setTextareaSize($(this));
        });
    }
};

ko.bindingHandlers.animateToState = {

    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
            allBindings = allBindingsAccessor(),
            element = $(element);

        element.children().hide();
        element.children('.' + allBindings.initialState).show();
    },

    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
            valueUnwrapped = ko.unwrap(value),
            element = $(element),
            eventualSize,
            allBindings = allBindingsAccessor(),
            currentStateElement = element.children(':visible'),
            nextStateElement = element.find('.' + valueUnwrapped),
            DURATION = 200;

        if (!currentStateElement.is('.' + valueUnwrapped)) {

            element.height(element.height());

            currentStateElement.animate({ opacity: 0 }, DURATION, function () {
                currentStateElement.hide();
                nextStateElement
                .show()
                .css({
                    opacity: 0,
                    overflow: 'hidden'
                })
                .animate({ opacity: 1 }, DURATION, function () {
                    $(this).css({ overflow: 'visible' });
                });
            });

            eventualSize = (function () {
                var size;

                nextStateElement.show();
                size = nextStateElement.height();
                nextStateElement.hide();

                return size;
            })();

            element.animate({ height: eventualSize + 'px' }, DURATION, function () {
                element.css('height', 'auto');
            });
        }
    }
};

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