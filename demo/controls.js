(function($) {	
	SELECTOR_VIDEO_CONTROLS = '.jquery-h264-video-controls';
	SELECTOR_VIDEO_CONTROLS_PLAY_BUTTON = '.jquery-h264-play-button';
	SELECTOR_VIDEO_CONTROLS_GUTTER = '.jquery-h264-gutter';
	SELECTOR_VIDEO_CONTROLS_PROGRESS = '.jquery-h264-progress';
	SELECTOR_VIDEO_CONTROLS_BUFFER = '.jquery-h264-buffer';
	SELECTOR_VIDEO_CONTROLS_PLAYHEAD = '.jquery-h264-playhead';
	
	init_ = VideoControls.prototype.init;
	window.MBRiOControls = $.extend(VideoControls, {});
	window.MBRiOControls.prototype = $.extend(VideoControls.prototype, {
		hasControls: function() {
			return (this.controls = this.element.find(SELECTOR_VIDEO_CONTROLS)).size() > 0
		},
		
		init: function() {
			this.playButton = this.element.find(SELECTOR_VIDEO_CONTROLS_PLAY_BUTTON);
			this.gutter = this.element.find(SELECTOR_VIDEO_CONTROLS_GUTTER);
			this.progress = this.element.find(SELECTOR_VIDEO_CONTROLS_PROGRESS);
			this.buffer = this.element.find(SELECTOR_VIDEO_CONTROLS_BUFFER);
			this.playhead = this.element.find(SELECTOR_VIDEO_CONTROLS_PLAYHEAD);
			
			init_.call(this);
			
			var seek = function(e) {
				this.seek(this.videoElement.duration * (e.offsetX / this.gutter.width()));
			}

			this.buffer.click(function(e) {
				seek.call(player, e)
			});

			this.progress.click(function(e) {
				seek.call(player, e)
			});
			
			this.element.css("display", "block");
		},
		
		update: function() {
			//var playheadProgress = this.gutter.width() * this.percentComplete;
			//this.progress.css("width", playheadProgress);
			//this.playhead.css("left", playheadProgress + this.progress.position().left - (this.playhead.width() / 2));
			//this.buffer.css("width", this.gutter.width() * this.percentLoaded);
		}
	});
})(jQuery)



var mbrio = (function($) {
	return {
		callbacks: {
			failed: function() {
				this.find(".error-message").css('display', 'inline');
			},
			
			//posterClicked: function() {
			//	if (this.hasControls) this.controls.css("visibility", "visible");
			//},
		
			//videoUpdating: function() {
			//	var playheadProgress = this.gutter.width() * this.percentComplete;
			//	this.progress.css("width", playheadProgress);
			//	this.playhead.css("left", playheadProgress + this.progress.position().left - (this.playhead.width() / 2));
			//	this.buffer.css("width", this.gutter.width() * this.percentLoaded);
			//}
		},
		
		init: function(selector, params, flparams) {
			/* Call h264 and receive an object that describes the results of the embedding */
			var player = $(selector).h264(params, flparams, this.callbacks);
			
			/*(function(isHTML5, player) {
				if (isHTML5) {
					if (!window.playVideo) window.playVideo = {};
					
					window.playVideo[selector] = function(video) {
						player.play(video);
					}

					$('.playlist').css("display", "block");
					
					player.videoContainer.mouseenter(function() {
						player.controls.fadeIn(250);
						player.update();
					}).mouseleave(function() {
						player.controls.fadeOut(250);
						player.update();
					});

					var seek = function(e) {
						this.seek(this.videoElement.duration * (e.offsetX / this.gutter.width()));
					}
					
					console.log(player.playhead.dragstart);

					player.buffer.click(function(e) {
						seek.call(player, e)
					});

					player.progress.click(function(e) {
						seek.call(player, e)
					});
				} else {
					// Do some Flash coding here with the results from flashembed
				}
			})(player.isHTML5, player.player)*/
		}
	}
})(jQuery)