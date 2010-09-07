	var VideoPlayer = function vp(ele, params, callbacks) {
		if (!(this instanceof arguments.callee)) return new vp(ele, params, callbacks);
	
		this.percentComplete = 0;
		this.percentLoaded = 0;
	
		this.element = ele;
	
		init_.call(this, params, callbacks);
	}

	var useVideoTag_ = function() {
		if (useVideoTag_.cache === null) {
			var obj = document.createElement(res.videoElementName);
			useVideoTag_.cache = !!(typeof(obj.canPlayType) !== 'undefined' && obj.canPlayType(res.h264Type));
		}
	
		return useVideoTag_.cache;
	}
	useVideoTag_.cache = null;

	var supportsCustomControls_ = function() {
		if (supportsCustomControls_.cache === null) {
			supportsCustomControls_.cache = navigator.userAgent.search(res.customControlQuery) === -1;
		}
	
		return supportsCustomControls_.cache;
	}
	supportsCustomControls_.cache = null;

	var init_ = function(params, callbacks) {
		initVideo_.call(this, params, callbacks);
		
		initControls_.call(this, params, callbacks);

		this.videoContainer.append(this.controls);
	
		this.element.empty();
		this.element.append(this.videoContainer);
	}

	var initVideo_ = function(params, callbacks) {
		this.videoContainer = $(res.divElement).css({
			width: params.width,
			height: params.height,
			position: 'relative'
		}).addClass(res.videoContainerClass);
	
		var ele = this.video = $(res.videoElement).attr(params).addClass(res.videoClass);
		this.videoElement = this.video.get(0);
	
		if (supportsCustomControls_() && params.poster && !params.autoplay) {
			var play = $(res.divElement).addClass(res.videoPosterPlayClass);
			ele = this.posterImage = $(res.divElement).css({
				width: params.width,
				height: params.height,
				background: "transparent url(" + params.poster + ") no-repeat",
				cursor: "pointer",
				position: "relative"
			}).click((function(player) {
				return function() {
					$(this).replaceWith(player.video);
					$.isFunction(callbacks.videoDisplayed) && callbacks.videoDisplayed.call(player);
					player.play();
				}
			})(this)).addClass(res.videoPosterClass).append(play);
		}
	
		this.videoContainer.append(ele);
	}

	var initControls_ = function(params, callbacks) {
		this.hasControls = supportsCustomControls_() && (this.controls = this.element.find(res.videoControlsSelector)).size() > 0;
	
		if (this.hasControls) {
			this.controls.remove();
		
			if (this.posterImage) this.controls.css("visibility", "hidden");
		
			this.video.attr("controls", null);
		
			this.playButton = this.controls.find(res.videoControlsPlayButtonSelector);
			this.gutter = this.controls.find(res.videoControlsGutterSelector);
			this.playhead = this.controls.find(res.videoControlsPlayheadSelector);
			this.progress = this.controls.find(res.videoControlsProgressSelector);
		
			this.playhead.css("width", 1);
	
			this.video.bind("timeupdate", $.proxy(updatePercentComplete_, this));
			this.video.bind("progress", $.proxy(updatePercentLoaded_, this));
	
			this.video.bind("play", $.proxy(displayPlaying_, this));
			this.video.bind("pause", $.proxy(displayPaused_, this));
			this.video.bind("ended", $.proxy(displayPaused_, this));
			
			this.playButton.click($.proxy(this.togglePlay, this));
			
			$.isFunction(callbacks.update) && (this.update = callbacks.update);
		}
	}

	var displayPlaying_ = function() {
		this.element.addClass(res.playingClass);
	}

	var displayPaused_ = function() {
		this.element.removeClass(res.playingClass);
	}	

	var updatePercentComplete_ = function() {
		this.percentComplete = (this.videoElement.currentTime * 100 / this.videoElement.duration) / 100;
		this.update();
	}

	var updatePercentLoaded_ = function() {
		this.percentLoaded = (this.videoElement.buffered.end() * 100 / this.videoElement.duration) / 100;
		this.update();
	}

	VideoPlayer.prototype.update = new Function();

	VideoPlayer.prototype.togglePlay = function() {
		if (this.element.hasClass(res.playingClass)) this.pause();
		else this.play();
	}

	VideoPlayer.prototype.play = function() {
		this.videoElement.play();
	}

	VideoPlayer.prototype.pause = function() {
		this.videoElement.pause();
	}
	