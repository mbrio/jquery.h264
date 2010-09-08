[jQuery h.264](http://github.com/mbrio/jquery.h264)
===================================================

Requirements
------------
* The current version of jQuery h.264 was developed using [jQuery](http://jquery.com) 1.4.2.

Introduction
------------
jQuery h.264 is a library that embeds an h.264 video using an HTML 5 video tag; if the browser does not support embedding h.264 then it falls back to a Flash solution; if that fails then the content within the target container div is not replaced.

**Previous versions of jQuery h.264 was reliant on the [Flash JW Player](http://www.google.com/search?q=jw+flash+player).  Current versions are not.**

In newer versions of Firefox that support the video tag but not h.264, the Flash player is used.

The library has been tested on an iPhone 4 and an iPad.

Demo
----
In order to get the demo running you'll need an h.264 encoded video, a poster image, and a copy of the Flash JW Player.

* The video should be placed in the root level and named video.m4v
* The poster image should be placed in the root level and named poster.jpg
* And the Flash JW Player should be placed in the root level and named player.swf

If you'd like to test the playlist capabilities you will need a second video.

* The video should be placed in the root level and named video2.m4v

While jQuery h.264 is not JW Player reliant, the demo is.  You can adjust the demo to test other flash players.

Flash Embedding
---------------
jQuery h.264 comes with a version of the [flashembed](http://www.google.com/search?q=jquery+tools+flashembed) library from jQuery Tools 1.2.4.

Custom HTML 5 Controls
----------------------
The current version supports basic video controls for the HTML 5 video player.  The controls are design independent and rely only on class names.

To see how this works look at demo/index.html.  The current system supports play, pause, visualization of buffered data, and visualization of "playhead".

The current control mechanics are in it's infancy and may undergo major revisions.

Build
-----
In order to build jQuery h.264 you must have [Ant](http://www.google.com/search?q=apache+ant).

	# ant
	
	Buildfile: build.xml

	jquery-h264:
	     [echo] ./dist/jquery.h264.js built.

	lint:
	     [exec] JSLint check passed.

	min:
	    [apply] Applied java to 1 file and 0 directories.
	   [delete] Deleting: ./dist/tmpmin
	     [echo] ./dist/jquery.h264.min.js built.

	all:

	BUILD SUCCESSFUL
	Total time: 2 seconds

Usage
-----
	jQuery.fn.h264(params, flparams, callbacks)

Parameters
----------
* `@params` = The HTML 5 video tag parameters
	* `src` = The video file URL
	* `poster` = The poster image URL
	* `preload` = One of the following values 'none', 'metadata', 'auto'
	* `autoplay` = Whether to begin the video on startup
	* `loop` = Whether to loop the video
	* `controls` = Whether to display the controls
	* `width` = The width of the video
	* `height` = The height of the video
* `@flparams` = The Flash parameters
	* `src` = The flash player URL
	* `version` = An array containing the version number, example: [9,0,24]
	* `expressInstall` = The express install URL
	* `w3c` = Use standards based markup
	* `cachebusting` = Prevents caching of the Flash file
	* `bgcolor` = The background color of the Flash file
	* `width` = The width of the video
	* `height` = The height of the video
	* `wmode` = The wmode of the flash player
	* `allowfullscreen` = Allow the flash video to support fullscreen
	* `allowscriptaccess` = Allow script access
	* `quality` = The flash quality
	* `flashvars` = The flashvars to pass onto the flash player
* `@callbacks` = Functions to call at specific times
	* `succeeded` = Executes when either an HTML 5 or Flash video player is embedded, is called within the scope of the jQuery object
	* `failed` = Executes when both HTML 5 and Flash embedding fail, if flparams is not supplied then the callback is executed when HTML 5 embedding fails; is called within the scope of the jQuery object
	* `completed` = Executes whether or not there is a success or failure at embedding, is called within the scope of the jQuery object
	* `videoUpdating` = Executes when video controls should be updated, is called within the scope of the HTML 5 VideoPlayer object
	* `posterClicked` = Executes when the poster frame is clicked, is called within the scope of the HTML 5 VideoPlayer object
	
Returns
-------
An object containing two properties; `isHTML5` which is a boolean value, and `player` which contains a reference to the returned embedded object.

If `isHTML5` is `true` then `player` is an instance of `VideoPlayer` from within the src/video-player.js file; if `isHTML5` is `false` then `player` is the result from jQuery Tools `flashembed`.

	var player = $("#VideoContainer").h264(params, flparams, callbacks);
	
	(function(isHTML5, player) {
		if (isHTML5) {
			player.videoContainer.mouseenter(function() {
				player.controls.fadeIn(250);
				player.update();
			}).mouseleave(function() {
				player.controls.fadeOut(250);
				player.update();
			});
		} else {
			// Do some Flash coding here with the results from flashembed
		}
	})(player.isHTML5, player.player);
	
VideoPlayer API
---------------
**Properties**

* `buffer` - The jQuery object representing the buffer component of the custom controls
* `controls` - The jQuery object representing the custom controls
* `element` - The jQuery object representing the embedded player
* `gutter` - The jQuery object representing the gutter component of the custom controls
* `hasControls` - Details whether the player has custom controls
* `percentComplete` - The percent of the video played
* `percentLoaded` - The percent of the video loaded
* `playButton` - The jQuery object representing the play button of the custom controls
* `playhead` - The jQuery object representing the playhead of the custom controls
* `posterImage` - The jQuery object representing the poster frame
* `progress` - The jQuery object representing the progress component of the custom controls
* `video` - The jQuery object representing the video tag
* `videoContainer` - The jQuery object representing the container of the video tag
* `videoElement` - The video tag DOM element

**Methods**

* `pause` - Pauses the video playback
* `play` - Plays a video, you may pass in a video URL in order to play a different video
* `seek` - Seeks to a location that is already buffered
* `togglePlay` - Toggles between play and pause
* `update` - Updates the custom controls