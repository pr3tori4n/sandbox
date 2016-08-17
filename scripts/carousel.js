var carousel = {
	defaults: {
		numtoshow: 1,
		numtoslide: 1,
		animationDuration: 500,
		autoScroll: false,
		timeperslide: 5000,
		loop: true,
		pagination: true,
		slideWidth: 0,
		gutter:12			
	},
	itemWidth: 0,
	klass: "carousel",
	mask_klass: "carousel-mask",
	wrapper_klass: "carousel-wrapper",
	slide_klass: "carouse-slide",
	pagination_klass: "carousel-pagination",
	page_klass: "carousel-page",
	init: function(element, options) {
		this.options = _.merge({}, this.defaults, options);
		var options = this.options;
		this.element = element;
		this.setup();
		this.calculateDimensions();
		this.addElements();
		this.setupEvents();
		if (options.autoScroll) {
			this.startSliding();
		}
	},
	setup: function() {
		var options = this.options;
		this.element.addClass(this.klass);
		this.defineObjects();
		//this.determineStatus();
		if (options.pagination) {
			this.pagination = this.buildPagination();
		}
		if (options.slideWidth) {
			this.itemWidth = options.slideWidth;
		}
	},
	defineObjects: function() {
		var options = this.options;
		this.wrapper = this.element.children("ul").addClass(this.wrapper_klass);
		this.items = this.wrapper.children("li");
		this.pages = Math.ceil(this.items.length / options.numtoslide);
		this.mask = $("<div/>").addClass(this.mask_klass);
		this.duration = options.animationDuration;
	},
	buildPagination: function() {
		var options = this.options,
			i = 1,
			pageContainer = $("<ul/>").attr("class", this.pagination_klass),
			html = "";
		while (i <= (this.pages - (options.numtoshow - options.numtoslide))) {
			html += '<li class="' + this.page_klass;
			if (i === 1) {
				html += ' is-active'
			}
			html += '" data-page="' + i + '"';
			html += ">&nbsp</li>";
			i++;
		}
		pageContainer.html(html);
		return pageContainer;
	},
	calculateDimensions: function() {
		var options = this.options,
			self = this;

		this.items.addClass(self.slide_klass);
		
		if (options.numtoshow === 1) {
			this.items.css("margin", 0);
		} else {
			this.items.css("margin", "0 "+options.gutter+"px");
		}
		if (this.itemWidth === 0) {
			this.itemWidth = this.items.first().outerWidth(true);
		}
		this.maxHeight = this.items.first().outerHeight(true)
		this.mask.css({
			width: this.itemWidth * options.numtoshow,
			height: this.maxHeight
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
		this.element.on("click", "." + this.page_klass, {self: this}, this.pageHandler);
	},
	pageHandler: function(event) {
		var self = event.data.self,
			item = $(this),
			options = self.options;

		event.preventDefault();
		self.gotoPage = item.data("page");
		self.slide();
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
			var items = this.pagination.find("li");
			items.removeClass("is-active");
			var item = items.get(this.gotoPage - 1);
			$(item).addClass("is-active");
		}
		this.duration = options.animationDuration;
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
	},
};