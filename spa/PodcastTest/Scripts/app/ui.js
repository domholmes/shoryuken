var app = window.app || {};

app.keycode = {
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ENTER: 13,
    DELETE: 46
};

app.MAX_COLUMN_WIDTH = 400;
app.subscriptionsCount = 6;

/**
* requestAnimationFrame and cancel polyfill
*/
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
                    window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                        timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
} ());


/**
* super simple carousel
* animation between panes happens with css transitions
*/
function Carousel(element) {
    var self = this;
    element = $(element);

    var container = $(">ul", element);
    var panes = [];

    var pane_width = 0;
    var pane_count = 0;
    var columnWidth = 0;
    var columnsPerPane = 0;

    var current_pane = 0;


    /**
    * initial
    */
    this.init = function () {
        var self = this;

        pane_width = $('body').width();
        setPaneCount();
        createPanes();
        setColumnsPerPane();
        addColumns();

        $(window).on("resize orientationchange", function () {

            self.showPane(0);
            container.empty();
            pane_width = $('body').width();
            setPaneCount();
            createPanes();
            setColumnsPerPane();
            addColumns();

        });

        $(window).on("keyup", function (event) {
            switch (event.which) {
                case app.keycode.LEFT_ARROW:
                    self.prev();
                    break;

                case app.keycode.RIGHT_ARROW:
                    self.next();
                    break;
            }
        });
    };


    function setPaneCount() {
        pane_count = Math.ceil((app.subscriptionsCount * app.MAX_COLUMN_WIDTH) / pane_width ); 
    };

    /**
    * set the pane dimensions and scale the container
    */
    function createPanes() {
        var i = 1;
        panes = [];
        container.empty();
        for (; i <= pane_count; i++) {
            panes.push($('<li class="pane' + i + '"></li>'));
        }
        $.each(panes, function () {
            this.width(pane_width).appendTo(container);
        });
        container.width(pane_width * pane_count);
    };    

    /**
    * set the amount of columns per pane and their width
    */
    function setColumnsPerPane() {
        columnsPerPane = Math.ceil(app.subscriptionsCount / pane_count);
    };

    function addColumns() {
        var panes = $('>li', container);
        var width = 100 / columnsPerPane;
        var template = $('#columnTemplate');
        var column;
        var paneIndex;
        for (var i = 0; i < app.subscriptionsCount; i++) {
            paneIndex = Math.ceil(((i + 1) / columnsPerPane));

            column = template.clone();
            column.removeAttr('id')
            .css({ 'width': width + '%', 'float': 'left' })
            .find('.column-content').prepend('<h2>Subscription ' + (i + 1) + '</h2>');

            panes.eq(paneIndex - 1).append(column);
        }
    };

    /**
    * show pane by index
    * @param   {Number}    index
    */
    this.showPane = function (index) {
        // between the bounds
        index = Math.max(0, Math.min(index, pane_count - 1));
        current_pane = index;

        var offset = -((100 / pane_count) * current_pane);
        setContainerOffset(offset, true);
    };


    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if (animate) {
            container.addClass("animate");
        }

        if (Modernizr.csstransforms3d) {
            container.css("transform", "translate3d(" + percent + "%,0,0) scale3d(1,1,1)");
        }
        else if (Modernizr.csstransforms) {
            container.css("transform", "translate(" + percent + "%,0)");
        }
        else {
            var px = ((pane_width * pane_count) / 100) * percent;
            container.css("left", px + "px");
        }
    }

    this.next = function () { return this.showPane(current_pane + 1, true); };
    this.prev = function () { return this.showPane(current_pane - 1, true); };



    function handleHammer(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch (ev.type) {
            case 'dragright':
            case 'dragleft':
                // stick to the finger
                var pane_offset = -(100 / pane_count) * current_pane;
                var drag_offset = ((100 / pane_width) * ev.gesture.deltaX) / pane_count;

                // slow down at the first and last pane
                if ((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
                        (current_pane == pane_count - 1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
                    drag_offset *= .4;
                }

                setContainerOffset(drag_offset + pane_offset);
                break;

            case 'swipeleft':
                self.next();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                self.prev();
                ev.gesture.stopDetect();
                break;

            case 'release':
                // more then 25% moved, navigate
                if (Math.abs(ev.gesture.deltaX) > pane_width / 4) {
                    if (ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                }
                else {
                    self.showPane(current_pane, true);
                }
                break;
        }
    }

    element.hammer({ drag_lock_to_axis: true })
            .on("release dragleft dragright swipeleft swiperight", handleHammer);
}


var carousel = new Carousel("#subscriptions");
carousel.init();