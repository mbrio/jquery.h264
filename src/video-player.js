	var VideoPlayer = function vp(ele, params, callbacks) {
		if (!(this instanceof arguments.callee)) return new vp(ele, params, callbacks);
	
		this.percentComplete = 0;
		this.percentLoaded = 0;
		this.callbacks_ = callbacks;
	
		this.element = ele;
	
		init_.call(this, params);
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

	var init_ = function(params) {
		initVideo_.call(this, params);
		
		initControls_.call(this, params);

		this.videoContainer.append(this.controls);
	
		this.element.empty();
		this.element.append(this.videoContainer);
	}

	var initVideo_ = function(params) {
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
				background: "transparent url(\"" + params.poster + "\") no-repeat",
				cursor: "pointer",
				position: "relative"
			}).click((function(player) {
				return function() {
					player.play();
				}
			})(this)).addClass(res.videoPosterClass).append(play);
		}
	
		this.videoContainer.append(ele);
	}

	var initControls_ = function(params) {
		this.hasControls = supportsCustomControls_() && (this.controls = this.element.find(res.videoControlsSelector)).size() > 0;
	
		if (this.hasControls) {
			this.controls.remove();
		
			if (this.posterImage) this.controls.css("visibility", "hidden");
		
			this.video.attr("controls", null);
		
			this.playButton = this.controls.find(res.videoControlsPlayButtonSelector);
			this.gutter = this.controls.find(res.videoControlsGutterSelector);
			this.progress = this.controls.find(res.videoControlsProgressSelector);
			this.buffer = this.controls.find(res.videoControlsBufferSelector);
			this.playhead = this.controls.find(res.videoControlsPlayheadSelector);
	
			this.video.bind("timeupdate", $.proxy(updatePercentComplete_, this));
			this.video.bind("progress", $.proxy(updatePercentLoaded_, this));
	
			this.video.bind("play", $.proxy(displayPlaying_, this));
			this.video.bind("pause", $.proxy(displayPaused_, this));
			this.video.bind("ended", $.proxy(displayPaused_, this));
			
			this.playButton.click($.proxy(this.togglePlay, this));
			
			$.isFunction(this.callbacks_.videoUpdating) && (this.update = this.callbacks_.videoUpdating);
		}
	}

	var displayPlaying_ = function() {
		this.element.addClass(res.playingClass);
	}

	var displayPaused_ = function() {
		this.element.removeClass(res.playingClass);
	}	

	var updatePercentComplete_ = function() {
		this.percentComplete = this.videoElement.currentTime / this.videoElement.duration;
		this.update();
	}

	var updatePercentLoaded_ = function() {
		var buffers = this.videoElement.buffered;
		var total = 0;
		var length = buffers.length;
		for (var i = 0; i < length; i++) total += (buffers.end(i) - buffers.start(i));
		
		this.percentLoaded = total / this.videoElement.duration;
		this.update();
	}

	VideoPlayer.prototype.update = new Function();

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
					player.video.attr('src', video);
					player.videoElement.load();
				}
				
				player.videoElement.play();
				player.update();
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
		this.update();
	}
	