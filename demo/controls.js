var mbrio = (function($) {
	return {
		callbacks: {
			failed: function() {
				this.find(".error-message").css('display', 'inline');
			},
			
			posterClicked: function() {
				if (this.hasControls) this.controls.css("visibility", "visible");
			},
		
			videoUpdating: function() {
				var playheadProgress = this.gutter.width() * this.percentComplete;
				this.progress.css("width", playheadProgress);
				this.playhead.css("left", playheadProgress + this.progress.position().left - (this.playhead.width() / 2));
				this.buffer.css("width", this.gutter.width() * this.percentLoaded);
			}
		},
		
		init: function(selector, params, flparams) {
			/* Call h264 and receive an object that describes the results of the embedding */
			var player = $(selector).h264(params, flparams, this.callbacks);
			
			(function(isHTML5, player) {
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

					player.buffer.click(function(e) {
						seek.call(player, e)
					});

					player.progress.click(function(e) {
						seek.call(player, e)
					});
				} else {
					// Do some Flash coding here with the results from flashembed
				}
			})(player.isHTML5, player.player)
		}
	}
})(jQuery)