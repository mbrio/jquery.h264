	$.h264 = {
		version: res.version
	}
	
	$.fn.h264HTML5_ = function(params, flparams, callbacks) {
		var result = VideoPlayer(this, params)

		if ($.isFunction(callbacks.success)) callbacks.success(this);
		
		return { isHTML5: true, player: result };
	};
	
	$.fn.h264Flash_ = function(params, flparams, callbacks) {
		var failed = false;
		var flashvars = flparams.flashvars;
		flparams.flashvars = null;
		
		flparams = $.extend({
			onFail: function() { failed = true; }
		}, flparams);
		
		var result = this.flashembed(flparams, flashvars);

		if (failed && $.isFunction(callbacks.failure)) callbacks.failure(this);
		if (!failed && $.isFunction(callbacks.success)) callbacks.success(this);
		
		return { isHTML5: false, player: result };
	};
	
	if (useVideoTag_()) $.fn.h264_ = $.fn.h264HTML5_;
    else $.fn.h264_ = $.fn.h264Flash_;
	
	$.fn.h264 = function(params, flparams, callbacks) {
		if (!$.isPlainObject(params)) params = { src: params };
		if (!$.isPlainObject(callbacks)) callbacks = { complete: callbacks };
		
		params = $.extend(def.params, params);
		
		flparams = $.extend(def.flparams, {
			width: params.width,
			height: params.height
		}, flparams);
		
		callbacks = $.extend(def.callbacks, callbacks);
		
		var result = this.h264_(params, flparams, callbacks);
		
		if ($.isFunction(callbacks.complete)) callbacks.complete(this);
		
		return result;
	};