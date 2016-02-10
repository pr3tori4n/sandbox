(function() {
	$.fn.dropdown = function() {
		var dd, span, val, $this, select = this;
		$this = $(select);
		dd = $("<div />", {
			"class":"dropdown",
			style:"width:"+$this.outerWidth()+"px"
		});
		dd = $this.wrap(dd).parent();
		val = $('option:selected', select).text();
		span = $("<span />", {
			"class":"dropdown_styled",
			text:val
		}).prependTo(dd);
		$this.addClass("dropdown_original");
		
		$this.on("change",function() {
	    	val = $('option:selected', select).text();
			span.text(val);
		});
	};
})(jQuery);