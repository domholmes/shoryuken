ko.bindingHandlers.confirm = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();

        $(element).confirm(value);
    }
}

ko.bindingHandlers.dialog = {
    init: function (element, valueAccessor) {
        var dialogModel = valueAccessor(),
            dialogWrapper;

        dialogModel.active = ko.observable(false);

        dialogModel.close = function(){
            $(dialogWrapper).find('.modal').modal('hide');
        };

        $(element).click(function(){

            dialogWrapper = document.createElement("div");

            document.body.appendChild(dialogWrapper);

            ko.renderTemplate("dialog", dialogModel, {}, dialogWrapper, "replaceChildren");

            $(dialogWrapper).find('.modal')
            .modal('show')
            .on('hidden.bs.modal', function () {
                ko.cleanNode(dialogWrapper);
                dialogWrapper.parentNode.removeChild(dialogWrapper);
            });
        });
    }
}

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

ko.bindingHandlers.setTimePeriod = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor(),
            reminder = bindingContext.$data;

        $(element).on('click', function () {

            reminder['setTo' + value]();
        });
    }
};

ko.bindingHandlers.editableText = {
    init: function (element, valueAccessor) {
        $(element)
            .attr('contenteditable', 'true')

            .on('keyup paste blur', function () {
                var observable = valueAccessor(),
                    propertyValue = observable.property,
                    placeholder = observable.placeholder || '';

                propertyValue($(this).text());

                if (propertyValue() === '') {
                    $(this).html("<span class='quiet'>" + placeholder + "</span>");
                }
            })

            .on('focus', function () {
                var observable = valueAccessor(),
                    propertyValue = observable.property,
                    placeholder = observable.placeholder || '';

                if (propertyValue() === '' || propertyValue() === placeholder) {
                    $(this).text("");
                }
            });
    },
    update: function (element, valueAccessor) {
        var observable = valueAccessor(),
            propertyValue = observable.property,
            placeholder = observable.placeholder || '';

        if (propertyValue() === "") {

            $(this).html("<span class='quiet'>" + placeholder + "</span>");

        } else if ($(element).html() !== propertyValue()) {

            $(element).text(propertyValue());

        }
    }
};

ko.bindingHandlers.finishedTyping = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var typingTimer;                //timer identifier
            doneTypingInterval = 2000,  
            propertyAccessor = valueAccessor().property,
            action = valueAccessor().action;

        (function (property) {

            $(element).on('input propertychange change', function () {

                clearTimeout(typingTimer);

                typingTimer = setTimeout(function () {
                    action(viewModel, property, $(element).val());
                }, doneTypingInterval);
            });

        })(propertyAccessor);
    }
};

ko.bindingHandlers.expandingTextarea = {
    init: function (element) {
        $(element)
            .addClass('expanding-textarea')
            .expandingTextarea();

        $(document).on('newState', function () {
            $(element).expandingTextarea('resize');
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
                 if ($(window).width() < 992) {
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
                        group.colClass = count() === 2 ? "col-sm-6" : "col-sm-3";
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
                new google.maps.LatLng(51.478389, -0.143616),
                new google.maps.LatLng(51.534804, -0.052979)), // central London  

            options = { bounds: defaultBounds },

            autocomplete = new google.maps.places.Autocomplete(element, options),

            convertToBounds = function (latLng, radius) {
                return new google.maps.Circle({ center: latLng, radius: radius }).getBounds();
            };

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            place = autocomplete.getPlace();

            value(place.formatted_address);
            bindingContext.$data.latLong(place.geometry.location.lat() + ',' + place.geometry.location.lng());
        });

        element.addEventListener('input', function (event) {
            bindingContext.$data.latLong(null);
            value(event.target.value);
        }, false);

        $.subscribe('currentLocation', function (_e, position) {
            autocomplete.setBounds(convertToBounds(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 10000));
        });
    },
    update: function (element, valueAccessor) {
        ko.bindingHandlers.value.update(element, valueAccessor);
    }
};