[jQuery h.264](http://github.com/mbrio/jquery.h264)
===================================================

Requirements
------------
* The current version of jQuery h.264 was developed using [jQuery](http://jquery.com) 1.4.2.
* Only JW Player 5.2 is currently supported for Flash player fallback.

Introduction
------------
jQuery h.264 is a library that embeds an h.264 video using an HTML 5 <video> tag; if the browser does not support embedding h.264 then it falls back to a Flash solution.

In newer versions of Firefox that support the <video> tag but not h.264, the Flash player is used.

The library has been tested on an iPhone 4 and an iPad.
	
Demo
----
In order to get the demo running you'll need an h.264 encoded video, a poster image, and a copy of the [Flash JW Player](http://www.google.com/search?q=jw+flash+player).

* The video should be placed in the root level and named video.m4v
* The poster image should be placed in the root level and named poster.jpg
* And the Flash JW Player should be placed in the root level and named player.swf