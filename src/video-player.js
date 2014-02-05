	// PLAYER ONLY
	NAMES_VIDEO_ELEMENT = 'video';
	ELEMENTS_DIV = '<div>';
	ELEMENTS_VIDEO = '<video>';
	ELEMENTS_IMG = '<img>';

	H264_TYPE = 'video/mp4; codecs="avc1.42E01E"';

	CSSCLASS_VIDEO = 'jquery-h264-video';
	CSSCLASS_VIDEO_CONTAINER = 'jquery-h264-video-container';
	CSSCLASS_POSTER = 'jquery-h264-video-poster';
	CSSCALSS_POSTER_PLAY = 'jquery-h264-poster-play';
	
	CSS_ABSOLUTE = 'absolute';
	CSS_RELATIVE = 'relative';
	CSS_POINTER = 'pointer';
	
	UNDEFINED = 'undefined';
	NONE = 'none';
	CONTROLS = 'controls'
	
	HTML_SRC = 'src';

	// Default objects
	DEFAULT_PARAMS = {
		preload: NONE,
		controls: CONTROLS,
		width: 640,
		height: 480
	}
	
	DEFAULT_FLPARAMS = DEFAULT_CALLBACKS = {}

	DEFAULT_NO_FLASH_VALUE = {
		isHTML5: false
	}

	window.VideoPlayer = VideoPlayer = function vp(ele, params, callbacks) {	
		this.percentComplete = 0;
		this.percentLoaded = 0;
		this.callbacks_ = callbacks;
	
		this.element = ele;
	
		init_.call(this, params);
	}

	VideoPlayer.supportsH264Video = function() {
		var obj = document.createElement(NAMES_VIDEO_ELEMENT);
		return typeof(obj.canPlayType) !== UNDEFINED && !!obj.canPlayType(H264_TYPE);
	}
	
	VideoPlayer.supportsPoster = function() {
		return navigator.userAgent.search(REGEX_CUSTOM_CONTROL) === -1;
	}

	var init_ = function(params) {
		this.videoContainer = $(ELEMENTS_DIV).css({
			width: params.width,
			height: params.height,
			position: CSS_RELATIVE
		}).addClass(CSSCLASS_VIDEO_CONTAINER);
	
		if (!!params.autoplay) params.preload = 'auto';
		
		var ele = this.video = $(ELEMENTS_VIDEO, params).addClass(CSSCLASS_VIDEO);
		this.videoElement = this.video.get(0);
		
		if (VideoPlayer.supportsPoster() && params.poster && !params.autoplay) {
			var play = $(ELEMENTS_DIV).css({
				width: params.width,
				height: params.height,
				position: CSS_ABSOLUTE,
				top: 0,
				left: 0
			}).addClass(CSSCALSS_POSTER_PLAY);
			
			var poster = $(ELEMENTS_IMG, {
				width: params.width,
				height: params.height,
				src: params.poster
			}).css({
				position: CSS_ABSOLUTE,
				top: 0,
				left: 0
			});
			
			ele = this.posterImage = $(ELEMENTS_DIV).css({
				width: params.width,
				height: params.height,
				cursor: CSS_POINTER,
				position: CSS_RELATIVE
			}).click((function(player) {
				return function() {
					player.play();
				}
			})(this)).addClass(CSSCLASS_POSTER).append(poster).append(play);
		}
		
		this.controls = new $.h264.controlsClass(this);
		
		this.videoContainer.append(ele);
		
		this.element.empty();
		this.element.append(this.videoContainer);
	}

	VideoPlayer.prototype.togglePlay = function() {
		if (this.videoElement.paused) this.play();
		else this.pause();
	}

	VideoPlayer.prototype.seek = function(time) {
		var buffers = this.videoElement.buffered;
		var length = buffers.length;
		
		for (var i = 0; i < length; i++) {
			if (time >= buffers.start(i) && time <= buffers.end(i)) {
				this.videoElement.currentTime = time;
				this.play();
				return true;
			}
		}
		
		return false;
	}

	VideoPlayer.prototype.play = function(video) {
		var play = (function(player, video) {
			return function(video) {
				if (video) {
					player.video.attr(HTML_SRC, video);
					player.videoElement.load();
				}
				
				player.videoElement.play();
			}
		})(this, video);

		if (this.posterImage) {
			this.posterImage.replaceWith(this.video);
			$.isFunction(this.callbacks_.posterClicked) && this.callbacks_.posterClicked.call(this);
		}
		
		play(video);
		this.play = play;
	}

	VideoPlayer.prototype.pause = function() {
		this.videoElement.pause();
	}
	
	/* jQuery methods */
	$.h264 = {
		version: JQUERY_H264_VERSION,
		controlsClass: VideoControls
	}
	
	h264_ = function(params, flparams, callbacks) {
		var result = $.extend(DEFAULT_NO_FLASH_VALUE);
		failed = true;
		
		if (flparams) {
			failed = false;
			var flashvars = flparams.flashvars;
			flparams.flashvars = null;
		
			flparams = $.extend({
				onFail: function() { failed = true; }
			}, flparams);
		
			var result = this.flashembed(flparams, flashvars);
		}

		$.isFunction(callbacks.failed) && callbacks.failed.call(this);
		$.isFunction(callbacks.succeeded) && callbacks.succeeded.call(this);
		
		return { isHTML5: false, player: result };
	}
	
	if (VideoPlayer.supportsH264Video()) {
		h264_ = function(params, flparams, callbacks) {
			var result = new VideoPlayer(this, params, callbacks)

			$.isFunction(callbacks.succeeded) && callbacks.succeeded.call(this);

			return { isHTML5: true, player: result };
		}
	}
	
	$.fn.h264 = function(params, flparams, callbacks) {
		if (!$.isPlainObject(params)) params = { src: params };
		if (!$.isPlainObject(callbacks)) callbacks = { completed: callbacks };
		
		params = $.extend(DEFAULT_PARAMS, params);
		
		flparams = flparams && $.extend(DEFAULT_FLPARAMS, {
			width: params.width,
			height: params.height
		}, flparams);
		
		callbacks = $.extend(DEFAULT_CALLBACKS, callbacks);
		
		var result = h264_.call(this, params, flparams, callbacks);
		
		$.isFunction(callbacks.completed) && callbacks.completed.call(this);
		
		return result;
	}
