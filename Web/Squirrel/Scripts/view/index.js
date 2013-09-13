ko.bindingHandlers.timePicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(),
            reminder = bindingContext.$data;

        $(element).timepicker({
            showMeridian: false,
            defaultTime: value()
        })
        .on('changeTime.timepicker', function (e) {
            value(e.time.value);
        });

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(),
            reminder = bindingContext.$data;

        $(element).timepicker('setTime', value());
    }
};

ko.bindingHandlers.setMeridian = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(),
            reminder = bindingContext.$data;

        $(element).on('click', function () {
            if (value === "AM") {
                reminder.setToAm();
            } else if (value === "PM") {
                reminder.setToPm();
            }
        });
    }
};

ko.bindingHandlers.expandingTextbox = {

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
            self.setTextareaSize(element);
        });

        $(document).on('newState', function (event, state) {
            if (state === 'edit') {
                self.setTextareaSize(element);
            }
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
                $(document).trigger('newState', valueUnwrapped);
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
        if (valueAccessor() == true) {
            $(element).slideDown(duration); // Make the element visible
        } else {
            $(element).hide();   // Make the element invisible
        }
    }
};

ko.bindingHandlers.foreachGroups = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var groupedItems,
             data = valueAccessor(),
             getGroupCount = function () {
                 if ($(window).width() < 979) {
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

ko.bindingHandlers.invisible = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).addClass('invisible-transition');
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor()
        if (value === true) {
            $(element).addClass('invisible');
        } else {
            $(element).removeClass('invisible');
        }
    }
};

ko.bindingHandlers.addressAutocomplete = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(),

            defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(-33.8902, 151.1759),
                new google.maps.LatLng(-33.8474, 151.2631)), // central London  

            options = { bounds: defaultBounds },

            autocomplete = new google.maps.places.Autocomplete(element, options),

            convertToBounds = function (latLng, radius) {
                return new google.maps.Circle({ center: latLng, radius: radius }).getBounds();
            };

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            place = autocomplete.getPlace();

            value(place.formatted_address);
            bindingContext.$data.latLong(place.geometry.location.pb + ',' + place.geometry.location.qb);
        });

        $.subscribe('currentLocation', function (_e, position) {
            autocomplete.setBounds(convertToBounds(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 10000));
        });
    },
    update: function (element, valueAccessor) {
        ko.bindingHandlers.value.update(element, valueAccessor);
    }
};