;(function($) {
	$.fn.heightAdjust = function(options) {
        var defaults = {
            tallest: true,
            shortest: false,
            forceHeight: false,
            height: 0
        };
        var options = $.extend({}, defaults, options);
        if (!options.tallest && !options.shortest && !options.forceHeight) {
            $.error(
                'heightAdjust requires one of the following options to be true: "tallest", "shortest" or "forceHeight".'
            )
        }
        var height = 0;
        if (options.forceHeight) {
            height = options.height
        } else {
            this.each(function() {
                var $this = $(this);
                if (options.shortest) {
                    height = (height === 0) ? $this.height() : Math.min(height, $this.height())
                } else {
                    if (options.tallest) {
                        height = Math.max(height, $this.height())
                    }
                }
            })
        }
        return this.each(function() {
            var $this = $(this);
            $this.height(height);
            if (options.forceHeight) {
                $this.css("overflow", "hidden")
            }
        })
    };
})(jQuery);
