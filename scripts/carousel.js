var carousel = {
	defaults: {
		numtoshow: 1,
		numtoslide: 1,
		animationDuration: 500,
		autoScroll: false,
		timeperslide: 5000,
		loop: true,
		pagination: false,
		slideWidth: 0,
		klass: "carousel",
		mask_klass: "carousel-mask",
		wrapper_klass: "carousel-wrapper",
		slide_klass: "carouse-slide",
		pagination_klass: "carousel-pagination",
		page_klass: "carousel-page"
	},
	itemWidth: 0,
	init: function(element, options) {
		this.options = _.merge({}, this.defaults, options);
		var options = this.options;
		this.element = element;
		this.setup();
		this.calculateDimensions();
		this.addElements();
		this.setupEvents();
		if (options.autoScroll) {
			this.startSliding()
		}
	},
	setup: function() {
		var options = this.options;
		this.element.addClass(options.klass);
		this.defineObjects();
		//this.determineStatus();
		if (options.pagination) {
			this.pagination = this.buildPagination()
		}
		if (options.slideWidth) {
			this.itemWidth = options.slideWidth
		}
	},
	defineObjects: function() {
		var options = this.options;
		this.wrapper = this.element.children("ul").addClass(options.wrapper_klass);
		this.items = this.wrapper.children("li");
		this.pages = Math.ceil(this.items.length / options.numtoslide);
		this.mask = $("<div/>").addClass(options.mask_klass);
		this.duration = options.animationDuration;
	},
	buildPagination: function() {
		var options = this.options,
			i = 1,
			pageContainer = $("<ul/>").attr("class", options.pagination_klass),
			html = "";
		while (i <= (this.pages - (options.numtoshow - options.numtoslide))) {
			html += '<li class="' + options.page_klass + '">';
			html += '<a href=""';
			if (options.direction === "left" && i === 1) {
				html += 'class="active"'
			}
			html += ' rel="' + i + '">';
			html += "&nbsp";
			html += "</a></li>";
			i++;
		}
		pageContainer.html(html);
		return pageContainer;
	},
	calculateDimensions: function() {
		var options = this.options,
			self = this;

		this.items.addClass(options.slide_klass);
		if (options.numtoshow === 1) {
			this.items.css("margin", 0);
		}
		if (this.itemWidth === 0) {
			this.itemWidth = this.items.first().outerWidth(true);
		}
		this.mask.css({
			width: this.itemWidth * options.numtoshow
		});
		this.wrapper.css("width", this.itemWidth * this.items.length);
	},
	addElements: function() {
		var options = this.options;

		this.mask = this.wrapper.wrap(this.mask).parent();
		if (options.pagination) {
			this.element.append(this.pagination);
		}
	},
	setupEvents: function() {
		var options = this.options;
		this.element.on("click", "." + options.page_klass + " li a", {
			self: this
		}, this.pageHandler);
	},
	pageHandler: function(event) {
		var self = event.data.self,
			item = $(this),
			options = self.options;

		event.preventDefault();
		self.gotoPage = item.attr("rel");
		this.slide();
	},
	slide: function(page, duration) {
		var self = this;
		
		this.stopSliding();
	  
		if (page && typeof page === "number") {
			this.gotoPage = page;
		}
		if (typeof duration === "number") {
			this.duration = duration;
		}
		this.slideAmount = this.getSlideAmount();

		this.wrapper.animate({
			left: this.slideAmount
		}, this.duration, function() {
			self.callback()
		})
	},
	callback: function() {
		var options = this.options;
		if (options.pagination) {
			var items = this.controls.find("li a");
			items.removeClass("active");
			var item = (options.direction === "left") ? items.get(this.gotoPage - 1) :
				items.get(this.pages - this.truePage());
			$(item).addClass("active");
		}
		this.duration = options.animationDuration;
	},
	truePage: function() {
		var a = this.options;
		return parseInt(this.gotoPage, 10) + (a.numtoshow - a.numtoslide);
	},
	getSlideAmount: function() {
		var options = this.options;
		return -(this.itemWidth * options.numtoslide * (this.gotoPage - 1));
	},
	startSliding: function(time_to_show) {
		var self = this,
			options = self.options;
		if (time_to_show && typeof time_to_show === "number") {
			options.timeperslide = time_to_show
		}
		this.interval = setInterval(function() {
			self.gotoPage++;
			self.slide();
		}, options.timeperslide)
	},
	stopSliding: function() {
		clearInterval(this.interval)
	}
};