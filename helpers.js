//something similar to the helpers file for Omni3 will live here, but what it will contain is not clear yet.
//If you'd rather test something overn othing, use the tablet version of helper.js

//FORM VALIDATION
(function(global,$) {	
	$.validator.addMethod("phoneUS", function(phone_number, element) {
	phone_number = phone_number.replace(/\s+/g, "");
	return this.optional(element) || phone_number.length > 9 &&
		phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
	}, "Please specify a valid phone number.");

	var zipCodeValidator = function(value, element) {
	  	var parsedVal=0;
        try{parsedVal=parseInt(value,10);}catch(exjs){}
      return this.optional(element) || (parsedVal!=0 && /^\d{5}-\d{4}$|^\d{5}$/.test(value));
	};
	$.validator.addMethod("zipcodeUS", zipCodeValidator, "Please enter your 5-digit zip code");
	
	var ssnValidator = function (value,element) {
		return this.optional(element) || /^(\d{3})[\-]?(\d{2})[\-]?(\d{4})$/.test(value);
	}
	$.validator.addMethod("usSocial", ssnValidator, "Please enter a valid 5 digit Zip Code.");
	
	jQuery.validator.addMethod("alphaOnly",function(value,element) {
		return this.optional(element) || value == value.match(/^[a-zA-Z\- ',\s]+$/);
	});
	$.validator.addMethod("alphaNumericOnly",function(value,element) {
		return this.optional(element) || value == value.match(/^[a-zA-Z0-9\-\. ',#&;/\s]+$/);
	});
	jQuery.validator.addMethod("usPhone",function(value,element){
		var regex = new RegExp("^(\\(\\d{3}\\)|\\d{3})[\\-\\s]?(\\d{3})[\\-\\s]?(\\d{4})$");
		return this.optional(element) || regex.test(value);
	});
})(window,jQuery);

/**
* Oberserver object
* Provides pub/sub functionality
* two methods, publish and subscribe
*/
App.helpers.observer = {
	subscribers:{},
	key:-1,
	subscribe:function(eventName,scope,callback){
		//Error Handling
		if(typeof eventName !== "string") {
			throw "observer.subscribe failed. the eventName must be a string (param 1)"
		}
		if(!callback && typeof scope === "function") {
			callback = scope;
			scope = null;
		}
		if((!scope && !callback) || (typeof callback !== "function")) {
			throw "observer.subscribe failed. a callback function is required"
		}
		//Subscribe logic
		var key = (++this.key).toString();
		if(!this.subscribers.hasOwnProperty(eventName)) {
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName].push({key:key,callback:callback,scope:scope});
		return key;
	},
	unsubscribe:function(eventName, key) {
		if(!eventName || !this.subscribers.hasOwnProperty(eventName)) {
			return false;
		} else {
			var i=0, len=0, subscribers = this.subscribers[eventName];
			if(!key) {
				delete this.subscribers[eventName]; //remove all subscribers to this event
				return true;
			} else {
				for (len=subscribers.length;i<len;i++) {
					if(subscribers[i].key === key) {
						subscribers.splice(i,1); //remove this callback subscribed to this eventName
						if(subscribers.length === 0) {
							delete this.subscribers[eventName];
						}
						return true;
					}
				}
				return false;
			}
		}
	},
	publish:function(eventName, data) {
		if(this.subscribers.hasOwnProperty(eventName)) {
			var subscribers = this.subscribers[eventName]; //e = document.createEvent("CustomEvent");
			for(i in subscribers) {
				if(subscribers.hasOwnProperty(i)) {
					if(!subscribers[i].scope) {
						subscribers[i].callback(data);
					} else {
						subscribers[i].callback.call(subscribers[i].scope, data);
					}
				}
			}
		}
	}
};

App.helpers.addLoadEventHandler = function(func) {
	var onloadFunc = function(){return;};
	if(typeof window.onload === "function") {
		onloadFunc = window.onload;
		window.onload = function() {
			onloadFunc();
			func();
		};
	} else {
		window.onload = func;
	}
};

App.helpers.handleFooterSignUpForm = function(formId){
	var form = $("form#"+formId),
			action = form.attr("action"),
			sourceid = form.find("input[name=SOURCEID]").val(),
			nav = form.find("input[name=NAV]").val(),
			email = form.find("input[name=EMAIL]").val();

		form.find("input[type=email]").val(""); // clear value
  	window.open(action+"?SOURCEID="+sourceid+"&NAV="+nav+"&EMAIL="+encodeURI(email));
};

/*
 * Custom Script to show modal content
 * Will provide both modal and colorbox type trigger
*/
App.helpers.closeModal = function(){
	App.helpers.observer.publish('closeModal',{forceClose:true, argList: App.helpers.modalKeys.callBackArgList});
};

App.helpers.modalKeys = {
	open:null,
	close:null,
	callBackArgList: {}
};

App.helpers.modal = function(html, options, openCallback, closeCallback) {
	var cWrapper, cls, container, win, _h, _w, validHtmlFlag, errorMessage, mWapper,
	defaults = {
		type: 'default',
		close: 'icon',
		easyclose: 'no',
		name: 'overlay',
		injectType:'html',
		wrapperClass: '',
		modalName:'',
		scProps:null
	};

	options = jQuery.extend({}, defaults, options);

	win = $(window);
	_h = win.height();
	_w = win.width();
	cls = 'modal-container';
	container = $('.' + cls);
	cWrapper = $('.content-wrapper');

	//assign class "is-hidden" if modal close type is "hide"
	if(options.close === "hide")options.close = "hide is-hidden";

	if (container.length === 0) {
		cls += ' ' + options.type;
		$('body').append("<div class='" + cls + "'><div class='modal-content-wrapper'><div class='close-button " + options.close + "'>Close</div><div class='modal-content'></div></div></div>");
		container = $('.modal-container');
	} else {
		cls += ' ' + options.type;
		container.attr('class', cls);
		container.find('.close-button').attr('class', 'close-button ' + options.close);
	}
	if(options && options.easyclose==="yes"){
		container.attr("supports-easy-close","yes");
	}else{
		container.removeAttr("supports-easy-close");
	}

	if(typeof html !== "undefined" && /^\s*$/.test(html) === false){
		validHtmlFlag = true;
		if(options.injectType === "append") {
			container.find('.modal-content').append(html);
		}else if(options.injectType === "iframe"){
			container.find('.modal-content').html('<iframe style="visibility:hidden;" onload="this.style.visibility = \'visible\';" width="'+_w*.80+'" height="'+_h*.60+'" src="'+html+'"></iframe>');
		}else if(options.injectType === "load"){
			container.find('.modal-content').load(html);
		}
		else {
			container.find('.modal-content').html(html);
		}
	} else{
		validHtmlFlag = false;
		errorMessage = options.errorMsg || '<h2>Content Unavailable</h2><br />&nbsp;<strong>Please try again. or <a href="http://www.verizonwireless.com/wcms/contact-us.html" onclick="vzwSc.trackLink(\'tablet:global:modal+error:contact+us\');" target="_blank">contact us</a> for assistance.</strong>';
		container.find('.modal-content').html('<div class="modal-padding">'+ errorMessage +'</div>');
	}

	App.helpers.modalKeys.callBackArgList = {
		openCallback: openCallback || null,
		closeCallback: closeCallback || null,
		updateOriginalHtml: options.updateOriginalHtml || null,
		validHtmlFlag: validHtmlFlag
	};

	container.find('.close-button, .canada-continue-btn').off('click.closeModal').on('click.closeModal', function() {
		App.helpers.observer.publish('closeModal',{
			name:options.name,
			argList: App.helpers.modalKeys.callBackArgList
		});
	});

	//Config to stop modal from closing if it is a forced modal
	if(options.close === 'hide'){
		container.data('modal-type', 'forced');
	} else{
		container.data('modal-type', 'unforced');
	}

	cWrapper.css({
		overflow: 'hidden',
		height: 0,
		width: '100%'
	});

	//THIS EVENT IS PAGE SPECIFIC AND DOESN'T BELONG HERE.
	$('.clear-all-action').off().on('click', function() {
		try{vzwSc.trackLink('Remove Cart Item');}catch(err){}
		App.helpers.observer.publish('closeModal',{
			name:options.name,
			argList: App.helpers.modalKeys.callBackArgList
		});
		setTimeout(function(){App.pages.general.clearAllCart();},500);
	});
	//THIS EVENT IS A DUPLICATE OF THE CLOSE BUTTON. IF THIS IS FOR PAGE SUPPORT IT SHOULD NOT BE HERE.
	$('.lnk-close-modal').off().on('click', function() {
		App.helpers.observer.publish('closeModal', {
			name:options.name,
			argList: App.helpers.modalKeys.callBackArgList
		});
	});

	container.css({
		'background-color': '#eff0f2',
		'position': 'fixed',
		'top': 0,
		'left': 0,
		'bottom': 0,
		'right': 0
	});

	//Alter Modal Wrapper Width
	mWrapper = container.find('.modal-content-wrapper');

	if(options.wrapperClass){
		mWrapper.addClass(options.wrapperClass);
	}

	//Modal Horizontal Align
	var modalPosX = (mWrapper.outerWidth() / 2 ) * -1;
	mWrapper.css('marginLeft', modalPosX+"px"); 

	container.show();

	var cachePageName = typeof vzwSc === "object" ? vzwSc.getProperty('pageName') : '';

	App.helpers.observer.unsubscribe('openModal', App.helpers.modalKeys.open);
	App.helpers.modalKeys.open = App.helpers.observer.subscribe('openModal',function(settings){
		if(settings.argList.validHtmlFlag){
			//Update the tooltip of current model
			var $tooltip = container.find('.tooltip');

			if($tooltip.length > 0 && typeof $.fn.betterTooltip !== "undefined"){
				$tooltip.betterTooltip();
			}

			//Update the iCheckbox of current model
			if (App.plugins.icheck !== undefined){
				App.plugins.icheck(container);
			}

			//Update the Tabs of current model
			App.plugins.tab(container);

			//For color dropdown inside modal
			App.plugins.selectPicker(container);

			if (settings.argList.openCallback){
				try {
					settings.argList.openCallback(container);
				} catch (e) {
					//Open Modal Callback exception handling
				}
			}
			
			if(options.modalName.length > 0) {
				var modalname = App.metrics.getModalPagename(options.modalName);
				if(options.scProps && typeof options.scProps === "object") {
					 App.helpers.observer.publish('trackPageView', {
						pageName: modalname,
						props: options.scProps
					});
				} else {
					App.helpers.observer.publish('trackPageView', modalname);
				}
			}
			//Readjust modal position if on IE Browser
			if( typeof App.pages.checkoutIESpecific !==  'undefined' ){
				//IESpecific
				App.pages.checkoutIESpecific.adjustModal();
			}
		}
	});

	$(window).off('resize.modal').on('resize.modal', function() {
		var scrollable = container.find('.modal-content').children(":visible").not(":empty").eq(0),
			wrapper = container.find('.modal-content-wrapper'),
			wh = ($(window).height() > 1020 ) ? 1020 : $(window).height() ;

		if (scrollable.removeAttr('style').height() > wh){
			scrollable.css({
				overflow: 'auto',
				maxHeight: wh - 80 - parseInt(scrollable.css('margin-top') || "0") - parseInt(scrollable.css('margin-bottom') || "0")
			});

			wrapper.css({
				marginTop: (wh - wrapper.outerHeight()) / 2
			});
	    } else {
	    	/*Defect modal width*/
			//wrapper.removeAttr('style');
	    }
	   
	}).trigger('resize.modal');

	App.helpers.modalKeys.close = App.helpers.modalKeys.close || App.helpers.observer.subscribe('closeModal',function(settings){
		container.hide();
		cWrapper.css({
			'overflow': 'visible',
			'height': 'auto'
		});

		if(settings.argList.validHtmlFlag){
			// if there is a visible tooltip it's because the modal
			// opened it, and in that case it needs to hide
			$(".tip").hide();

			if(settings.argList.updateOriginalHtml){
				//For selectively Updating User changed HTML in modal to original copy in DOM, so that if same popup opened again user can see last state of the modal
				settings.argList.updateOriginalHtml.find('[data-for-post-update]').each(function(){
					var $thisItem = $(this),
					sectionName = $thisItem.data('for-post-update');

					$thisItem.html(container.find('.modal-content [data-for-post-update="'+ sectionName +'"]').html());
				});
			}

			if (settings.argList.closeCallback){
				try {
					settings.argList.closeCallback(container);
				} catch (e) {
					//Close Modal Callback Exception handling
				}
			}
		}
		if(typeof vzwSc !== "undefined") {
			vzwSc.trackLink('Close');
			var cachePageName = typeof vzwSc === "object" ? vzwSc.getProperty('pageName') : '';
			vzwSc.setPageName(cachePageName);
		}
	});

	App.helpers.observer.publish('openModal', {
		name:options.name,
		argList: App.helpers.modalKeys.callBackArgList
	});

	return container;
};
/**
Handler for closing overlays when user presses ESC key on keyboard
The modal-container div should have attribute supports-easy-close="yes"
While opening the modal, the options can be configured to send additional property
"easyclose" as "yes"
App.helpers.modal(html,{easyclose:"yes"},opencallback,closecallback);
*/
App.helpers.modalEasyCloseHandler = function(){
	var container=$(".modal-container");
	if(container[0] && container[0].offsetWidth>0 && container[0].offsetHeight>0){ /*Checking whether modal exists & is open, NOT using jQuery(container).css("display")!=="none" for comparison as it fails in older browsers*/
		if(container.attr("supports-easy-close")==="yes"){
			App.helpers.closeModal();
		}
	}
};

$(function(){
	$(document.body).on("keydown",function(e){
		if(e.which===27){ /*User pressed ESC key*/
			App.helpers.modalEasyCloseHandler();
		}
	});
});
/*
 * provides modal /colorbox type plugin
 * a.modal.retrieve(href="#", rel="close=text|target=.retrieve-modal")
 * a.modal.retrieve(href="#", data-colorbox="type=colorbox|close=text|target=.retrieve-modal")
 */

$(function() {
  $(document.body).on('click','.modal',function(e) {
    e.preventDefault();
    var chunk, content, i, rel, settings, _i, _len, _t;
    rel = $(this).data('colorbox');
	settings = {};
	if(typeof rel === "string") {
    chunk = rel.split('|');
    for (_i = 0, _len = chunk.length; _i < _len; _i++) {
      i = chunk[_i];
      _t = i.split('=');
      settings[_t[0]] = _t[1];
    }
	} else if (typeof rel === "object") {
		settings = rel;
	}
    content = $(settings.target).html();
    if(typeof settings.name === "undefined") {
    	App.helpers.modal(content, settings);
    } else {
		var cachePageName = vzwSc.getProperty('pageName');
	    openCallback = function() {
	    	var modalname = App.metrics.getModalPagename('/' + settings.name);
	    	var scProps = {
	    			products:'',
        			prop26:'',
                prop11:'',
                prop13:'',
        			eVar16:'',
					prop16:'',
					eVar75:'',
					list2:''
            }
    	   App.helpers.observer.publish('trackPageView', {
               pageName: modalname,
               props: scProps
           });
	    };
	    closeCallback = function() {
	        vzwSc.setPageName(cachePageName);
	    };
	    App.helpers.modal(content, settings, openCallback, closeCallback);
    }

  });
  $.cookie('javascriptEnabled','true',{path: '/' });
});

/**
 * Global Touch bind to hide modal container on tap outside container
 */
/**
 *  This is not needed as per defect #19946 - modals should not close when tapping/clicking outside of the content area
 * 
$(document).on('touchstart mousedown', function(e){
  var container = $('.modal-container');
  if( container.find(".modal-content-wrapper").has(e.target).length === 0 && container.data('modal-type') === 'unforced') {
    if(container.css('display') === 'block') {
		App.helpers.closeModal();
    }
  }
});*/

/** PLUGINS
 *	These fire automatically on dom ready on all pages.
 *
 **/

/**
 * Triggers All slider
 */
App.plugins.slider = function(container) {
	container = typeof container == 'undefined' ? $(document.body) : $(container);

	var $this= this;
	App.plugins.slider.mySwiper = null;
	var getSliderSettings = function(item){
		var settings = {
			dflt: {
				slidesPerView: 'auto'
			},
			infinite: {
				loop: true,
				slidesPerView: 1,
				pagination: '.slider-tab',
				paginationClickable: true
			}
		};

		var scrollbar = {
			container :'.swiper-scrollbar',
			hide: false,
			draggable: true
		};

		var sliderSettings = settings.dflt;

		if(item.hasClass('infinite')) {
			sliderSettings = settings.infinite;
		}

		if (item.hasClass('vertical')) {
			sliderSettings.mode = 'vertical';
		}

		if(item.data("autoplay") && item.data("autoplay") !== 'false')
		{
			sliderSettings.autoplay = item.data("autoplay");
		}

		sliderSettings.followFinger = !('ontouchstart' in window);

		if (item.hasClass('scrollbar')) {
			var scrollDiv = item.data('scrollbar');
			$(scrollDiv).empty();
			sliderSettings.scrollbar = scrollbar;
			sliderSettings.scrollbar.container = scrollDiv;
			sliderSettings.followFinger = true;
			sliderSettings.freeMode = true;
		}
		return sliderSettings;
	};

	container.find('.slider:not(.slider-processed)').each(function() {
		var $el = $(this);
		if ($el.is(':visible') && !$el.hasClass('slider-processed')) {
			if ($el.find('.swiper-wrapper').length === 0)
				return;

			var slider = $el,
				settings = getSliderSettings(slider),
				mySwiper = new Swiper(this, settings),
				prev = slider.find('.prev'),
				next = slider.find('.next'),
				updateArrows;

			$el.data("swiper", mySwiper).addClass('slider-processed');

			var $lengh = mySwiper.slides.length - 1;
			prev.hide();
			prev.on('click', function(e) {
				e.preventDefault();
				if (slider.find('.swiper-slide').length > 0) {
					mySwiper.swipePrev();
					next.show();
				}
			});

			next.on('click', function(e) {
				e.preventDefault();
				prev.show();
				if (slider.find('.swiper-slide').length > 0) {
					mySwiper.swipeNext();
					prev.show();
				}
			});

			mySwiper.wrapperTransitionEnd(updateArrows = function() {
				var $first = $(mySwiper.slides[0]);
				$last = $(mySwiper.slides[$lengh]);

				if ($first.hasClass("swiper-slide-visible") && $first.offset().left >= 0) {
					prev.hide();
				} else {
					prev.show();
				}

				if ($last.hasClass("swiper-slide-visible") && $last.offset().left <= $(window).width() - $last.width()) {
					next.hide();
				} else {
					next.show();
				}
			}, true);

			updateArrows();
		}
	});

	// all product item
	container.find(".products-wrapper").each(function() {
		if( $(this).hasClass('slider') ) return;
		App.plugins.slider.mySwiper = new Swiper(this,{
			slidesPerView: 'auto'
		});
	});
};

/**
 * A custom script that provides
 * Tab feature and hover functionality
 */
App.plugins.tab = function($target) {

	var tabMenuItems = (typeof $target !== "undefined") ? $target.find(".tab ul.tab-menu li") : $(".tab ul.tab-menu li");

	tabMenuItems.on('click', function(e){
		e.preventDefault();
		var $el = $(this);
		if( !$el.hasClass('disable') ){
			if(! $el.hasClass('active')){
				var parent = $el.parents('.tab');
				var ind = $el.index();
				var tagDiv = parent.children('div.tab-item');
				$el.addClass('active').siblings().removeClass('active');
				$(tagDiv[ind]).show().siblings('.tab-item').hide().siblings('.tab-start').hide();
				App.helpers.observer.publish("toggleTab",{selectedTab:$el, selectedIndex:ind, selectedContent:$(tagDiv[ind]), tabContainer:parent});
			}
			$(".tab ul.tab-menu li.activeAction").removeClass('activeAction');
		}
	});
	tabMenuItems.each(function(){
		var $el = $(this);
		if( $el.hasClass('active')){
			var parent =  $el.parents('.tab');
			var ind =  $el.index();
			var tagDiv = parent.children('div.tab-item');
			$(tagDiv[ind]).show().siblings('.tab-item').hide();
		}
	});
};

App.plugins.hover = function() {
	// this is for main menu tab item
	$(".header .tab-menu li").live('mouseover', function(){
		var ind = $(this).index();
		var tagDiv = $('.header div.tab-item');
		$(this).addClass('active').siblings().removeClass('active');
		$(tagDiv[ind]).addClass('active').siblings().removeClass('active');
	});
};
/*
 * App.helpers.ajax: Helper method for making $.ajax calls
 * Param 1: options: $.ajax configurations
 * Param 2: ajaxName: String Name for ajax call to identify the calls
 * Param 3: context: User passed object gets passed to success or error callbacks unchanged into second parameter
 *
**/
//Object to keep track of Ajax calls so that same Ajax doesn't go multiple time.
App.helpers.ajaxStack = [];
App.helpers.ajax = function(options, ajaxName, context) {
	if (typeof options.url === 'undefined' || /^\s*$/.test(options.url) === true) {
		return;
	}
	if(typeof ajaxName !== 'undefined' && App.helpers.ajaxStack[ajaxName]){
		App.helpers.ajaxStack[ajaxName].abort();
	}
	var $loader = {},
		config = $.extend({}, {
			url: '',
			type: 'get',
			dataType: 'html',
			data: '',
			async: true,
			cache: true,
			loader: false,
			beforeSend: function(){
				if(config.loader){
					$loader = $(document.body).loader();
					$loader.showMe();
				}
				if (typeof options.methodToCallBeforeAjax === 'function'){
					if(typeof context !== 'undefined'){
						options.methodToCallBeforeAjax(context);
					} else{
						options.methodToCallBeforeAjax();
					}
				}
			},
			success: function(data) {

				if(typeof ajaxName !== 'undefined' && App.helpers.ajaxStack[ajaxName]){
					App.helpers.ajaxStack[ajaxName] = false;
				}
				if(typeof options.successCallback === 'function'){
					if(typeof context !== 'undefined'){
						options.successCallback(data, context);
					} else{
						options.successCallback(data);
					}
				}
			},
			error: function(xhr){

				if(typeof ajaxName !== 'undefined' && App.helpers.ajaxStack[ajaxName]){
					App.helpers.ajaxStack[ajaxName] = false;
				}
				if(typeof options.errorCallback === 'function'){
					if(typeof context !== 'undefined'){
						options.errorCallback(xhr, context);
					} else{
						options.errorCallback(xhr);
					}
				}
			},
			complete: function(){

				if(typeof ajaxName !== 'undefined' && App.helpers.ajaxStack[ajaxName]){
					App.helpers.ajaxStack[ajaxName] = false;
				}
				if(config.loader && $loader.hideMe){
					$loader.hideMe();
				}
				if(typeof options.completeCallback === 'function'){
					if(typeof context !== 'undefined'){
						options.completeCallback(context);
					} else{
						options.completeCallback();
					}
				}
			},
			statusCode:{
				200:function(){},
				404:function(){}
			},
			done: function(){},
			fail: function(){},
			always: function(){},
			timeout: 80000
		}, options);

	if(typeof config.completeCallback !== 'undefined'){
		delete config.completeCallback;
	}

	if(typeof config.methodToCallBeforeAjax !== 'undefined'){
		delete config.methodToCallBeforeAjax;
	}

	if(typeof config.errorCallback !== 'undefined'){
		delete config.errorCallback;
	}

	if(typeof config.successCallback !== 'undefined'){
		delete config.successCallback;
	}

	if(typeof ajaxName !== 'undefined'){
		App.helpers.ajaxStack[ajaxName] = $.ajax(config);
	} else{
		$.ajax(config);
	}
};

App.helpers.ajax2 = function(options) {
  var loader = options.loader || true;

  if (options.methodToCallBeforeAjax) {
    options.methodToCallBeforeAjax();
  }

  $.ajax({
    url: options.url,
    type: options.methodType || 'get',
    dataType: options.dataType || 'html',
    data: options.data || '',
    async: options.async || true,
    cache: options.cache || true,
    loader: options.loader || true,
    beforeSend: function(){
			if(loader){
				loader = $("body").loader();
				loader.showMe();
			}
    	if(typeof options.beforeSend == "function"){
    		options.beforeSend();
    	}
    },
    success: options.success || function(data) {},
    error: options.error || function(xhr){},
    complete: function(){
    	if(loader && loader.hideMe){
    		loader.hideMe();
    	}
    	if(typeof options.complete == "function"){
    		options.complete();
    }
    },
    statusCode:{
    	200:function(){},
    	404:function(){}
    },
    done: options.done || function(){},
		fail: options.fail || function(){},
		always: options.always || function(){}
  });
};

App.helpers.popup = function(strURL,strType,strHeight,strWidth){
	var strOptions="";
	if (strType=="flashPopup") strOptions="resizable,height="+strHeight+",width="+strWidth;
	if (strType=="popup") strOptions="scrollbars,resizable,height="+strHeight+",width="+strWidth;
	if (strType=="fullScreen") strOptions="scrollbars,location,directories,status,menubar,toolbar,resizable";
	window.open(strURL, 'newWin', strOptions);
};

(function($){
	/**
	 * Ajax Loader animation
	 */
	var loader = {
		defaults:{
			useDefaultSkin:true,
			skin:null,
			show:true,
			reuse:true
		},
		defaultSkin:'spinner',
		element: null,
		loader:null,
		isBody:false,
		init:function(element,options) {
			this.element = element;
			this.options = jQuery.extend({}, this.defaults,options);
			this.isBody = (this.element.get(0) === window.document.body);
			this.loader = (this.options.reuse) ? this.getExisting() : this.createLoader();
			if(this.isBody) {
				this.loader.css('position','fixed');
			}
			this.element.append(this.loader);
			if(this.options.show) {this.showMe();}
		},

		showMe: function() {
			var myLoader = this.loader;
			if(!$('.credit-processed').length && App.constants.transactionType != 'EUP' && ( $('.o-ssn').length || $('input[name="caabSSN"]').length)){
				
				myLoader.html("<div id='creditCheckOverlay1' class='innerLoader'>Hang tight, We're checking your credit. This usually takes about 15 seconds, but could take up to a minute. </div>").css({'visibility': 'visible', 'background-image': 'none'});
				  var seconds = 0;
				 
				  function countdown() {
				 
				    if (seconds < 25) {
				    	
				    } else if (seconds < 45) {
				    	myLoader.html("<div id='creditCheckOverlay2' class='innerLoader'>Credit checks aren't always as fast as our network. We just need a little more time.</div>").css({'visibility': 'visible', 'background-image': 'none'});
				    } else if (seconds < 60) {
				    	myLoader.html("<div id='creditCheckOverlay3' class='innerLoader'>You're almost at the finish line! This won't take any longer than 15 more seconds.</div>").css({'visibility': 'visible', 'background-image': 'none'});
				    }
				    
					  if($('.innerLoader').length && $('.innerLoader').is(':visible')){
						  seconds++;
						  timeoutMyOswego = setTimeout(countdown, 1000);
					  }
				   
				  }
				 
				  countdown();
				
				
				}else{
					this.loader.css('visibility', 'visible');	
				}
			
		},
		
		
		
		hideMe: function() {
			this.loader.css('visibility', 'hidden');
		},

		createLoader: function() {
			var loader = $('<div/>');
			if(this.options.useDefaultSkin) {
				loader.addClass(this.defaultSkin);
			}
			if(this.options.skin) {
			loader.addClass(this.options.skin);
			}
			if(typeof window.onbeforeunload != "undefined") { //hack for IE to continue GIF animation after a POST is executed
				window.onbeforeunload = function() {
					var bg_image = loader.css("background-image");
					loader.css("background-image","none");
					loader.css("background-image",bg_image);
				};
			}
			return loader;
		},
		
		getExisting: function() {
			var existing = $("."+this.defaultSkin).eq(0);
			if(existing.length > 0) {
				return existing;
			} else {
				return this.createLoader();
			}
		}
	};

	$.fn.loader = function(options) {
		if($(this).length > 0) { var $o = Object.create(loader); $o.init($(this), options); return $o; }
	};

	/*Tooltip shown on hover*/
	$.fn.betterTooltip = function( opts ) {

		if ($('.tip').length === 0) {
			$("body").prepend("<div class='tip'><div class='tip-pointer arrow-up'></div><div class='tipMid'></div></div>");
		}

		var defaults = {
			hover: false,
			preventDefault:true
		};

		opts = $.extend( {}, defaults, opts );

		var setTip, tip, tipInner, toogleTip;
		tip = $('.tip');
		tipPointer = tip.find('.tip-pointer');
		tipInner = $('.tip .tipMid');

		$(this).unbind().bind("click showTip", function(e) {
			var $this = $(this);
			if(!$this.hasClass('tooltip'))
				return;
				
			if( opts.preventDefault ) {
				e.preventDefault();
			}

			if (tip.data("interval")) {
				clearInterval(tip.data("interval"));
				tip.data("interval", null);
			}

			// Check if tip is already visible for another tooltip
			if (tip.css('display') === 'block' && !$(this).hasClass('processed')) {
				tip.hide();
				$('.tooltip.processed').removeClass('processed');
			}

			var content = $this.data('tooltip'),
				target = $this.data('target');

			if (typeof target == 'undefined')
				//CR 14182
				tipInner.html(content.replace(new RegExp('\[.]\n','g'), '.<br /><br />'));
			else {
				content = $(target).html();
				//$(content).removeClass('hidden');
				tipInner.html(content);
			}

			// Remove Tip Pointer arrow class
			tipPointer.removeClass(function(index, css) {
				return (css.match(/\barrow\S+/g) || []).join(' ');
			});

			$this.data('offset', $this.offset());
			$this.data('scroll', $(window).scrollTop());

			var inView = function($el) {
				var docViewTop = $(window).scrollTop(),
					docViewBottom = docViewTop + $(window).height(),
					elemTop = $el.offset().top,
					elemBottom = elemTop + $el.height();

				return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
			}

			var positionTooltip = function(ignore) {
				var offset, tLeft, tTop, tWidth, tHeight, type, prevOffset;

				if (!ignore && (!inView($this) || !$this.is(":visible"))) {
					tip.hide();
					$('.tooltip.processed').removeClass('processed');
					clearInterval(tip.data("interval"));
					tip.data("interval", null);
					return;
				}

				if (!ignore && !tip.is(":visible")) {
					clearInterval(tip.data("interval"));
					tip.data("interval", null);
					return;
				}

				prevOffset = $this.data('offset');
				offset = $this.offset();

				if (!ignore && prevOffset.left == offset.left && prevOffset.top == offset.top && $this.data('scroll') == $(window).scrollTop())
				{
					// nothing moved, return
					return;
				}

				$this.data('offset', $this.offset());
				$this.data('scroll', $(window).scrollTop());

				tLeft = offset.left;
				tTop = offset.top;
				tWidth = $this.width();
				tHeight = $this.height();

				setTipOverrides($this);
				
				type = $this.data('type');
				if (type === 'top')
					setTopTip(tTop, tLeft, tWidth, tHeight);
				else if (type === 'right')
					setRightTip(tTop, tLeft, tWidth, tHeight);
				else if (type === 'left')
					setLeftTip(tTop, tLeft, tWidth, tHeight);
				else if (type === 'bottom')
					setBottomTip(tTop, tLeft, tWidth, tHeight);
				else
					setMiddleTip(tTop, tLeft, tWidth, tHeight);

				// if might not be needed, but needs testing across the board
				if (type !== 'top' && type !== 'right' && type !== 'left' && type !== 'bottom')
				{
					// check if the tooltip goes off the screen
					var hide = tip.is(":hidden"),
						m = 5;
					hide && tip.show();

					if (tip.offset().left < m && tip.offset().left + tip.width() > $(window).width())
					{
						// change the width and location
						tip.css({
							width: 'auto',
							left: m,
							right: m
						});
					} else if (tip.offset().left + tip.width() > $(window).width() - m)
					{
						// if the tooltip goes off the screen, make it
						tip.css({
							right: m,
							left: 'auto'
						});
					} else if (tip.offset().left < m)
					{
						tip.css({
							left: m
						});
					}

					var pointerLeft = tLeft - tip.offset().left + (tWidth / 2);

					/* caret check added for QC 13681 */
					var caret = $this.children().filter(function() {
						return $(this).attr("class").indexOf("caret") > -1;
					});

					if (caret.length > 0)
					{
						pointerLeft = pointerLeft - (tWidth / 2) + caret.position().left - $this.position().left + tipPointer.width() / 2;
					}

					if (pointerLeft + tipPointer.width() > tip.width() - m)
					{
						pointerLeft    = tip.width() - tipPointer.width();
					}

					tipPointer.css({
						left: pointerLeft
					});

					hide && tip.hide();
				}
			};

			tip.data("interval", setInterval(positionTooltip, 1));
			positionTooltip(1);

			tip.find('.close').click(function(e) {
				e.preventDefault();
				$this.removeClass('processed');
				tip.hide();
			});

			if (tip.is(':visible')) {
				$this.removeClass('processed');
				tip.hide();
			} else {
				$this.addClass('processed');
				tip.show();
			}
		});

		/**
		 * This overrides visibility properties of tip
		 * data-rel_right setPosition of tip relative to tooltip element
		 * data-rel_bottom setPosition of tip relative to tooltip element
		 *
		 */
		setTipOverrides = function($em) {
			var relRight = $em.data('rel_right'),
				relBottom = $em.data('rel_bottom'),
				relWidth = $em.data('rel_width'),
				emWidth = $em.width(),
				emHeight = $em.height(),
				emLeft = $em.offset().left,
				emTop = $em.offset().top,
				nLeft, nRight, nTop,
				tipLeft = tip.offset().left,
				tipRight = tip.offset().right,
				tipWidth = tip.width(),
				tipHeight = tip.height();

			if (relWidth !== undefined) {
				tip.css({
					width: relWidth
				});
				var diff = tip.width() - tipWidth;
				tipWidth = tip.width();
				tipLeft -= diff;
			}

			if (relRight !== undefined) {
				// Move Position relative right
				nLeft = emLeft + emWidth - tipWidth + relRight;
				tip.css({
					left: nLeft
				});
				tipPointer.css({
					left: 'auto',
					right: (relRight - 3)
				});
			} else if (relBottom !== undefined) {
				nTop = emTop + (emHeight / 2) - tipHeight + relBottom;
				tip.css({
					top: nTop
				});
				tipPointer.css({
					top: (tipHeight - relBottom - 13)
				});
			}

		};

		/**
		 * if data-type is set to 'top'
		 */
		setTopTip = function(top, left, width, height) {

			var xTip, yTip,
				tipHeight = tip.height();
			xTip = (left + width - 104) + "px";
			yTip = top - tipHeight - 23;
			tip.css({
				'top': yTip,
				'left': xTip,
				'right': 'auto'
			});

			tipPointer.addClass('arrow-bottom');
			tipPointer.css({
				left: '50%',
				top: tipHeight
			});

		};

		/**
		 * if data-type is set to 'right'
		 */
		setRightTip = function(top, left, width, height) {

			var xTip, yTip, tipWidth = tip.width(),
				tipHeight = tip.height();
			// 26 is the width of tip-pointer arrow-left
			xTip = (left + 26 + width) + "px";
			yTip = top + (height / 2) - (tipHeight / 2);
			tip.css({
				top: yTip,
				left: xTip,
				right: 'auto'
			});

			tipPointer.addClass('arrow-left');
			tipPointer.css({
				left: -18,
				top: (tipHeight / 2 - 13)
			});

		};

		/**
		 * if data-type is set to 'left'
		 */
		setLeftTip = function(top, left, width, height) {

			var xTip, yTip, tipWidth = tip.width(),
				tipHeight = tip.height();
			// 26 is the width of tip-pointer arrow-left
			xTip = (left - tipWidth - 24) + "px";
			yTip = top + (height / 2) - (tipHeight / 2);
			tip.css({
				top: yTip,
				left: xTip,
				right: 'auto'
			});

			tipPointer.addClass('arrow-right');
			tipPointer.css({
				left: tipWidth + 7,
				top: (tipHeight / 2 - 8)
			});

		};
		/**
		 * Set Tip Position normal
		 */
		setBottomTip = function(top, left, width, height) {
			var xTip, yTip;

			xTip = ((left - tip.outerWidth(true) * 0.5) + width * 0.5) + "px";
			yTip = (top + height + 16) + "px";
			tip.css({
				'top': yTip,
				'left': xTip,
				'right': 'auto'
			});

			tipPointer.addClass('arrow-up');
			tipPointer.css({
				left: '50%',
				top: -10
			});
		};
		/**
		 * Set Tip Position normal
		 */
		setMiddleTip = function(top, left, width, height) {
			var xTip, yTip;
			xTip = (left + width - 104) + "px";
			yTip = (top + (height / 2) + 16) + "px";
			tip.css({
				'top': yTip,
				'left': xTip,
				'right': 'auto'
			});

			tipPointer.addClass('arrow-up');
			tipPointer.css({
				left: '50%',
				top: -10
			});
		};

		if( opts.hover ) {

			var $this = $(this);
			$this.hover(
				function() {
					$(this).trigger('showTip');
				}, 
				function() {
					/* CR 24952 : No need to hide the tip when mover is out from the element. */
					//$this.removeClass('processed');
					//tip.hide();				
				}
			);
		};
	};


	$(function() {
	  $('.tooltip').betterTooltip({
	  	hover: true
	  });
	});

	$(document).mouseup(function(e) {
		var container,arrow;
		container = $('.tip');
		if (container.has(e.target).length === 0 && $(e.target).hasClass('tooltip') === false ) {
			container.hide();
			$('.tooltip.processed').removeClass('processed');
		}
	});
	
	/*
	//commenting this line as it is preventing backspace
	$(":input[readonly]").on("keydown",function(e) {
		if(e.which === 8) {
			e.preventDefault();
		}
	});*/
	$.fn.changeGroup = function(options) {
		var group = this;
		return this.each(function() {
			$(this).on("change",function(e) {
				group.removeClass("is-active");
				$(e.currentTarget).addClass("is-active");
			});
		});
	};
	$.fn.clickGroup = function(options) {
		var group = this;
		return this.each(function() {
			$(this).on("click",function(e) {
				group.removeClass("is-active");
				$(e.currentTarget).addClass("is-active");
			});
		});
	};
	$.fn.heightAdjust = function() {
		var h = 0;
		this.each(function() {
			h = Math.max( h, $(this).height() );
		});
		return this.each(function() {
			$(this).height(h);
		});
	};
	//dropdown
	$.fn.customSelect = function(e) {
        var config = {
			customSelectClass: 'dropdown_option',
			hideClass: 'dropdown_hideSelect',  
            activeClass: 'is-dropdown-active', 
            wrapperElement: '<div class="dropdown" />'  
        };
        this.each(function() {
            var selectElem = $(this), selectWidth = $(this).outerWidth();
			selectElem.addClass(config.hideClass);
            selectElem.wrap(config.wrapperElement);
            var parentWidth = $(this).closest('div.dropdown');   
            parentWidth.width(selectWidth);
            var update = function() {
                val = $('option:selected', this).text();
                span.text(val);
            };
            selectElem.change(update);
            selectElem.keyup(update);
			selectElem.on("updateDropdown",update);
            /* To prevent (modern) screen readers from announcing the fake select in addition to the real one, aria-hidden is used to hide it.*/
            var span = $('<span class="' + config.customSelectClass + '" aria-hidden="true">' + $('option:selected', this).text() + '</span>');
            selectElem.after(span);
            selectElem.on({
                mouseenter: function() {
                    span.addClass(config.activeClass);
                },
                mouseleave: function() {
                    span.removeClass(config.activeClass);
                },
                focus: function() {
                    span.addClass(config.activeClass);
                },
                blur: function() {
                    span.removeClass(config.activeClass);
                }
            });
        });
    };
})(jQuery);

/**
 * METRICS TRACKING: Custom Events
 * [Object] props - name:value pairs of metrics to be sent for tracking
 * Example: var props = {prop22:'edge',event8:null,eVar75:'',prop13:9};
 * The names in the props object used in both custom events corrolates very closely to site catalyst properties.
 * The name should match a property on the s object (i.e. prop11, eVar75, channel).
 * These are case sensitive. If the property does not already exist on the s object, then the value will not take (i.e. typeof s.prop11 cannot equal undefined).
**/
/*
 * How to use: trackPageView
 * Call the publish method on the observer, with the eventName of 'trackPageView'.
 * The data object has two useable properties: pageName [required - string] and props [optional - object].
 * The pagename is the name of the page you're tracking. The props property is an object holding name:value pairs. See above notes for more info.
 * Example 1: object: var dataObject = {pageName:s.prop1+'/verizon edge/',props:{eVar75:'',prop22:'edge'}};
 * Example 1: method invokation: App.helpers.observer.publish('trackPageView',dataObject);
 * Example 2: var pagename = s.prop1+'/verizon edge/';
 * Example 2: method invokation: App.helpers.observer.publish('trackPageView',pagename); //update props and track link/event
 */
App.helpers.observer.subscribe('trackPageView',function(data){/*deprecated*/});
/*
 * How to use: trackEvent
 * Call the publish method on the observer, with the eventName of 'trackEvent'.
 * The data argument can either be an object for complex tracking or a string for simple tracking.
 * The object has two useable properties: linkName [required - string] and props [optional - object].
 * The linkName is the name of the event/link you're tracking. The props property is an object holding name:value pairs. See above notes for more info.
 * Example 1: method invokation: App.helpers.observer.publish('trackEvent','Continue'); //track link/event
 * Example 2: object: var dataObject = {linkName:'Continue',props:{eVar46:"Authenticated User"}};
 * Example 2: method invokation: App.helpers.observer.publish('trackEvent',dataObject); //update props and track link/event
 */
App.helpers.observer.subscribe('trackEvent',function(data) {/*deprecated*/});

/* helper function for concatenating parent page name with modal name. Return value is set as pageName property prior to tracking page view. */
App.metrics.getModalPagename = function (modalName) {
	var pagename = '';
	if(typeof vzwSc !== "undefined" && vzwSc.getProperty('prop1') !== null) {
		pagename += vzwSc.getProperty('prop1');
	}
	if(typeof modalName !== "undefined") {
		modalName = (typeof modalName === "string") ? modalName : modalName.toString();
		pagename += modalName;
	}
	return pagename;
};

(function($, global) {
	var App = global.App;
	/*
	 * Automatic Event tracking for elements with the data-tracking attribute when clicked.
	 * Sample Implementation
	 * <button class="btn" data-tracking="Continue">Continue</button>
	 */
	$(document.body).on("click","[data-tracking]",function(e) {
		App.helpers.observer.publish('trackEvent',$(this).data('tracking'));
	});

	/*
	 * Automatic Event tracking for elements with the data-track-change attribute when changed.
	 * Sample Implementation
	 * <input type="radio" name="contracts" value="24" data-track-change="24" />
	 */
	$(document.body).on("change",":input[data-track-change]",function(e) {
		App.helpers.observer.publish('trackEvent',$(this).data('trackChange'));
	});

	$(document.body).on("click","[data-track-check]",function(e) {
		var checkValue = $(this).data('trackCheck');
		var chunk = checkValue.split('|');
		var isChecked = $(this).is(':checked');
		if(isChecked) {
			App.helpers.observer.publish('trackEvent',chunk[0]);
		} else {
			App.helpers.observer.publish('trackEvent',chunk[1]);
		}

	});
})(jQuery, window);


/**
 * This renders all checkbox/radios to iCheck
 * That is a contributed 3rd party plugin
 * http://damirfoy.com/iCheck/
 */
App.plugins.icheck = function(container){
  var container = (typeof container === 'undefined') ? $(document.body) : $(container),
  checkboxes = container.find("input.checkbox:not(.initialized)");
  if (checkboxes.length>0) {

    checkboxes.iCheck();

    // Little hack to change the value of original input
    checkboxes.on('ifChecked', function(){
      $(this).attr('checked', 'checked').parents('label').addClass('active');
      });

      checkboxes.on('ifUnchecked', function(){
      $(this).removeAttr('checked').parents('label').removeClass('active');
      });

      checkboxes.addClass('initialized');
  }
  window.iCheckPluginLoaded=true;
};

/**
 * Bootstrap Select Plugin
 * @return {[type]} [description]
 */
App.plugins.selectPicker = function(selector) {
  // 'auto' does not behave properly in some cases.
  // changing to '6', tho it may be overriden by an attribute in the select element (data-size='N')
  $.fn.selectpicker.defaults.size = '6';

  var $selector = (typeof selector === "undefined") ? $('.selectpicker:not(.processed)') : $(selector).not('.processed');

  if($selector.length > 0){
		$selector.addClass("processed").selectpicker({
			'selectedText': 'cat'
		});
	}
};

/** 
 * Toggle Plugin
 * When clicking an element shows/hides another element.
 */
App.plugins.toggler = function () {
	$(".c-toggleContent:not('[data-open=true]')").addClass("is-toggle-collapsed");
	$(document).on("click",".c-toggleHandle",function(e) {
		e.preventDefault();
		var $this = $(this), icon, target = $this.attr("href") ? $(this).attr("href") : $(this).data("href"); //Anchors are preferred handles, but other elements are supported via data attribute
		if(!target) {return;}
		App.helpers.observer.publish("toggle", {handle:this, id:target, opening:$(target).hasClass("is-toggle-collapsed")})
		$(target).toggleClass("is-toggle-collapsed");
	});
	//Used to add a custom class to the bootstrap accordion
	$(document).on("click.accordion","[data-toggle=collapse]",function(e) {
		var isCollapsed = $(this).hasClass("collapsed");
		$(this)[isCollapsed ? "removeClass" : "addClass"]("is-active");
	});
};
App.plugins.swap = function() {
	$(".c-swap").on("click",".c-swapTarget",function(e) {
		var container = $(this).parents(".c-swap");
		$(".c-swapTarget",container).removeClass("is-hidden");
		$(this).addClass("is-hidden");
	});
}
App.plugins.dropdown = function () {
	$('select.c-dropdown').customSelect();
};
/**
 * Get type of a credit card
 *
 * @param {String} cardNumber
 * @returns {String|cardTypes.MASTERCARD|cardTypes.VISA|cardTypes.AMEX|cardTypes.DISCOVER}
 */
App.helpers.getCardType = function(cardNumber) {
    var cardRegex = {
        VISA: "^4[0-9]{12}(?:[0-9]{3})?",
        MASTERCARD: "^5[1-5][0-9]{14}$",
        AMEX: "^3[47][0-9]{13}$",
        DISCOVER: "^6(?:011|5[0-9]{2})[0-9]{12}$"
    }, cardTypes = {
        VISA: "visa",
        MASTERCARD: "mastercard",
        AMEX: "amex",
        DISCOVER: "discover"
    };

    if (cardNumber.length === 15) {
        return cardNumber.match(cardRegex.AMEX) ? cardTypes.AMEX : null;
    } else if (cardNumber.length === 16) {
        if (cardNumber.match(cardRegex.VISA)) {
            return cardTypes.VISA;
        } else if (cardNumber.match(cardRegex.MASTERCARD)) {
            return cardTypes.MASTERCARD;
        } else if (cardNumber.match(cardRegex.DISCOVER)) {
            return cardTypes.DISCOVER;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

/**
 * check if a SSN is valid
 *
 * @param {type} ssn
 * @returns {Boolean}
 */
App.helpers.isValidSSN = function(ssn) {
    var reg = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/,
        temp = ssn;

    if (reg.test(ssn)) {
        if (ssn.indexOf("-") !== -1) temp = (ssn.split("-")).join("");

        if (ssn.indexOf(" ") !== -1) temp = (ssn.split(" ")).join("");

        return !(temp.substring(0, 3) === '000' || temp.substring(3, 5) === '00' || temp.substring(5, 9) === '0000');
    } else {
        return false;
    }
};

/**
 * Opens a pop-up window when called from click event
 *
 * @param {String} url, {number} width, {number} height
 * @returns {Boolean}
 */
App.helpers.windowPopUp= function(url, width, height){
	if(this.windowObjRef === undefined){
		this.windowObjRef = {winObjRef:null, previousUrl:null};
	} 
	
	var leftPosition, topPosition, params;
 
	leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
 
	topPosition = (window.screen.height / 2) - ((height / 2) + 50);

	params = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=yes,location=no,directories=no";
 
	if(this.windowObjRef.winObjRef == null || this.windowObjRef.winObjRef.closed)
	  {
	  this.windowObjRef.winObjRef = window.open(url, "Window2", params);	
	  }
	else if(this.windowObjRef.previousUrl != url)
	  {
	  this.windowObjRef.winObjRef = window.open(url, "Window2", params);	
	  if(this.windowObjRef.winObjRef.focus)
	    {
	    this.windowObjRef.winObjRef.focus();
	    };
	 
	  }
	else
	  {
	  if(this.windowObjRef.winObjRef.focus)
	    {
	    this.windowObjRef.winObjRef.focus();
	    };
	  };
	this.windowObjRef.previousUrl = url;
}

/*Temporary solution until we can update Modernizr*/
App.helpers.detectMediaQueries = function() {
	var supported, d = document.createElement('div');
	d.className = "mediatest";
	document.body.appendChild(d);
	if( window.getComputedStyle && window.getComputedStyle(d).position == "absolute") {
		// supports media queries!
		supported = true;
	} else {
		supported = false;
	}
	document.body.removeChild(d);
	return supported;
}

/**
 * Utility functions
 *
 * @type @new;_L1330
 */
App.utils = new function() {
    var me = this;

    this.findKeyPressed = function(evt) {
        evt = (evt) ? evt : window.event;
        return (evt.which) ? evt.which : evt.keyCode;
    };

    /**
     * Restricts a user input to valid U.S phone number type only
     * Usage : $(someInputObject).on('keypress', App.utils.restrictPhoneInput)
     * @param {event} evt
     * @returns {Boolean}
     */
    this.restrictPhoneInput = function(evt) {
        var isValid = false,
            keyCode = me.findKeyPressed(evt);

        if (evt.ctrlKey || evt.altKey || evt.shiftKey || $.inArray(keyCode, [8, 9, 13, 127])) {
            isValid = true;
        } else {
            isValid = /(\d|\-|\.|\(|\)|\x20)/.test(String.fromCharCode(keyCode));

            if (!isValid) evt.preventDefault();

        }
        return isValid;
    };

    /**
     * Restricts a user input to valid U.S Social Security number
     * Usage : $(someInputObject).on('keypress', App.utils.restrictSSNInput)
     * @param {event} e
     * @returns {Boolean}
     */
    this.restrictSSNInput = function(e) {
        var isValid = false,
            keyCode = me.findKeyPressed(e);

        if (e.ctrlKey || e.altKey || e.shiftKey || $.inArray(keyCode, [8, 9, 13, 127])) {
            isValid = true;
        } else {
            isValid = /(\d|\-|\x20)/.test(String.fromCharCode(keyCode));

            if (!isValid) e.preventDefault();
        }
        return isValid;
    };
    /*
    * Generic loader image method for display Loader while shwitching between pages
    */
    this.displayLoader = function(e){
    	var $loader={};
		$loader = $(document.body).loader();
		$loader.showMe();
    };
    this.preloadLoader = function(){
    	/*$('body').append('<img src="../../omni/d/i/MLS_Preload.gif" id="newLoader"  style="position: fixed;top:-50%; left:-50%;" />');
    	*/
    	/* Fix for defect 12346 */
    	$('body').append('<img src="//scache.vzw.com/gng/img/new_dot_loader_large.gif" id="newLoader"  style="position: fixed;top:-50%; left:-50%;" />');
    	
    }
};
//All time are in seconds
//stepTime(in sec) : Interval at which function will be called
//clearTimer(in sec) : Time after which function will be timed out
App.helpers.sessionMaintain = function (stepTime, clearTimer, intervalFunc) {
	var elapsedTime=0;
	clearTimer=clearTimer * 1000;
	if(typeof stepTime === undefined) {
		stepTime = 1000;
	} else {
		stepTime = stepTime*1000;
	}

	var intervalHandler = setInterval(function(){
		intervalFunc();
		elapsedTime += stepTime;
		if(clearTimer === elapsedTime)
			clearInterval(intervalHandler);
	}, stepTime);      
};

App.helpers.populateImage = function(){
	var securePic = new Image();
	securePic.src = "https://"+window.location.host+"/vzw/secure/seg.png?id="+(new Date().getTime());
};

App.helpers.renderEqualHeights = function(){
	$('.c-equalHeightContainer').each(function(){
		$(this).children().outerHeight('auto');
		$(this).children().outerHeight($(this).height());
	});
};


/*CR 17243: load the Google map api asynchronously*/
App.helpers.loadGoogleMapAPI = function(callbackFunc){
	if(typeof googleMapAPIURL !== 'undefined'){
		var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.src = googleMapAPIURL +'&callback='+ callbackFunc;
	  document.body.appendChild(script);
	}
};

/*
 *Utility function which helps to determine if element is present in viewport
 * -- Toggling display of the target element on / off is known to cause issues.
 * -- Retuns false if element is not (yet) in viewport, returns true if element is in viewport
 * -- rect variable has top/left/right/bottom based on viewport top/left.
 */

App.helpers.isElementinViewPort = function(el){

	/*if jquery element is passed*/
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    /*getBoundingClientRect() works on IE8+*/
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );

}


/* Client Side Price updates on price banner*/
App.helpers.updatePriceProgressBar = {

	/*var progressbarElem = $(".progressBar"),
	monthlyPriceElem = progressbarElem.find("#monthlyPrice .progressBar_cost"),
	dueNowElem = progressbarElem.find("#dueNow .progressBar_cost");*/	

	progressbarElem :$(".progressBar"),
	monthlyPriceElem : $(".progressBar").length !==0 ? $(".progressBar").find("#monthlyPrice .progressBar_cost") : $("div.o-config-progress").find("#monthlyPrice").find(".o-cost"),
	empMonthlySavingsElem :$(".progressBar").length !==0 ? $(".progressBar").next(".progressBar_employeeDiscount").find("#emp-mon-savings") : $(".o-progress-bar").find("#emp-mon-savings"),
	dueNowElem: $(".progressBar").find("#dueNow .progressBar_cost"),
	// Adding elements for new Price Details Section 
	priceDetailsMonthly: $("#priceDetailsContainer #priceDetailsMonthly"),
	priceDetailsToday: $("#priceDetailsContainer #priceDetailsToday"),
	priceDetailsEmpSavings: $("#priceDetailsContainer #emp-mon-savings"),
	pastDueBalanceElem : $(".progressBar").find(".c-pastDueBalanceAmt-AddedToOrder"),
	setMonthlySavings:function(newSavings){
		this.empMonthlySavingsElem.text("$"+newSavings.toFixed(2));
		this.priceDetailsEmpSavings.text("$"+newSavings.toFixed(2));
	},
	setMonthlyPrice: function(newPrice){		
		this.monthlyPriceElem.text("$"+newPrice.toFixed(2));
		this.priceDetailsMonthly.text("$"+newPrice.toFixed(2));
	},
	setDueNow: function(newPrice){
		if(this.pastDueBalanceElem[0]){
			var pastDue  = this.pastDueBalanceElem.val();
			if(pastDue != undefined && pastDue != null && pastDue != "" && pastDue.length > 0){
				pastDue = pastDue.replace("$","").replace(",","");
				if(!isNaN(parseFloat(pastDue))){
					pastDue = parseFloat(pastDue);
					newPrice = newPrice+pastDue;
				}
			}
		}
		this.dueNowElem.text("$"+newPrice.toFixed(2));
		this.priceDetailsToday.text("$"+newPrice.toFixed(2));
	},
	getMonthlyPrice: function(){
		return parseFloat(this.monthlyPriceElem.text().split('$')[1]);
	},
	getMonthlySavings:function(){
		return parseFloat(this.empMonthlySavingsElem.text().split('$')[1]);
	},
	getDueNow: function(){
		if(this.pastDueBalanceElem[0]){
			var pastDue  = this.pastDueBalanceElem.val();
			if(pastDue != undefined && pastDue != null && pastDue != "" && pastDue.length > 0){
				pastDue = pastDue.replace("$","").replace(",","");
				if(!isNaN(parseFloat(pastDue))){
					pastDue = parseFloat(pastDue);
				}else {
					pastDue = 0;
				}
				
			}else {
			  pastDue = 0;
			}
			return parseFloat(this.dueNowElem.text().split('$')[1]) - pastDue;
		}else {
		    return parseFloat(this.dueNowElem.text().split('$')[1]);
		}
	}	
};
/* Client Side Price updates on price banner-Ends*/

/**
 * Simplistic string sanitizing utility https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet
 * @param string text typically from an input field
 * @return string input text with &, <, >, ", ', \ replaced with 
 *         htmlEntity values representing those characters.
 */
App.helpers.sanitizeInput = function sanitizeInput(userInput) {
	var sanitizedOutput;
	sanitizedOutput = userInput.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)/gi, '&amp;')
		.replace(/</gi, '&lt;')
		.replace(/>/gi, '&gt;')
		.replace(/"/gi, '&quot;')
		.replace(/'/gi, '&#x27;')
		.replace(/\//gi, '&#x2F;');
	
	return sanitizedOutput;
};


/**
 * Main Controller
 */
$(function(){
   App.helpers.renderEqualHeights(); //renders equal heights for elements inside classed containers
   App.plugins.icheck(); // Renders custom checkbox look
   App.plugins.selectPicker();   //bootstrap custom select plugin
   App.plugins.toggler();
   App.plugins.swap();
    App.plugins.dropdown();
   //App.utils.preloadLoader()
   	if(/(^|;)\s*loggedIn=/.test(document.cookie)){
   		//console.log("User Logged In");
   		App.helpers.populateImage();
		/*run timer based session check for every 10 mins till 30 mins*/
   		App.helpers.sessionMaintain(600, 1800, function() {
			App.helpers.populateImage();
		});	
   	}
   
});
