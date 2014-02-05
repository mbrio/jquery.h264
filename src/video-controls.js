	// CONTROLS ONLY
	CSSCLASS_PLAYING = 'playing';

	//window.VideoControls = VideoControls = function vc(ele, video, container) {
	window.VideoControls = vc = function vc(player) {
		this.player = player;
		this.video = player.video;
		this.element = player.element;
		this.videoElement = player.videoElement;
		this.container = player.videoContainer;
		
		console.log(this.hasControls());
		
		if (VideoControls.supportsControls() && this.hasControls()) this.init();
	}
	
	vc.supportsControls = function() {
		return navigator.userAgent.search(REGEX_CUSTOM_CONTROL) === -1;
	}
	
	vc.prototype.init = function() {
		initControls_.call(this);

		//this.container.append(this.controls);
	}

	vc.prototype.hasControls = function() {
		return false;
	};
	
	vc.prototype.update = new Function();
	
	var initControls_ = function() {	
		//if (this.hasControls) {
			//this.controls.remove();
		
		//	if (this.posterImage) this.controls.css("visibility", "hidden");
		
			this.video.attr("controls", null);
				
			this.video.bind("timeupdate", $.proxy(updatePercentComplete_, this));
			this.video.bind("progress", $.proxy(updatePercentLoaded_, this));
	
			this.video.bind("play", $.proxy(displayPlaying_, this));
			this.video.bind("pause", $.proxy(displayPaused_, this));
			this.video.bind("ended", $.proxy(displayPaused_, this));
			
		//	this.playButton.click($.proxy(this.togglePlay, this));
			
			this.update();
		//}
	}
	
	var displayPlaying_ = function() {
		this.container.addClass(CSSCLASS_PLAYING);
		this.update();
	}

	var displayPaused_ = function() {
		this.container.removeClass(CSSCLASS_PLAYING);
		this.update();
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
	
	$.videoControls = {
		version: JQUERY_H264_VERSION
	}
	