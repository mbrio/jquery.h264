	// Beginning of the jQuery h.264 code
	// Create private variables that represent many string values
	var res = {
		version: '@VERSION',
		videoElementName: 'video',
		divElement: '<div>',
		videoElement: '<video>',
		customControlQuery: /iphone|ipod|ipad|android/i,
		h264Type: 'video/mp4; codecs="avc1.42E01E"',
		videoClass: 'jquery-h264-video',
		videoContainerClass: 'jquery-h264-video-container',
		videoPosterClass: 'jquery-h264-video-poster',
		videoPosterPlayClass: 'jquery-h264-poster-play',
		videoControlsSelector: '.jquery-h264-video-controls',
		videoControlsPlayButtonSelector: '.jquery-h264-play-button',
		videoControlsGutterSelector: '.jquery-h264-gutter',
		videoControlsPlayheadSelector: '.jquery-h264-playhead',
		videoControlsProgressSelector: '.jquery-h264-progress',
		playingClass: 'playing'
	}

	// Default objects
	var def = {
		params: {
			src: null,
			poster: null,
			preload: 'none',
			autoplay: null,
			loop: null,
			controls: 'controls',
			width: '100%',
			height: '100%'
		},
		flparams: {
			src: null,
			version: [9],
			expressInstall: null,
			w3c: false,
			cachebusting: false,
			bgcolor: null,
			wmode: 'opaque',
			allowfullscreen: true,
	        allowscriptaccess: 'always',
			quality: 'high',
			flashvars: {}
		},
		callbacks: {
			complete: null,
			success: null,
			failure: null
		},
		noFlashReturn: {
			isHTML5: false,
			player: null
		}
	}

