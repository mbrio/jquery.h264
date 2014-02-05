/**
 * jQuery h.264 library 1.0.7
 * http://github.com/mbrio/jquery.h264
 *
 * Copyright (c) 2010 Michael Diolosa - http://github.com/mbrio
 * Dual-licensed under the GPL and MIT licenses.
 *
 * Date: Wed Sep 8 15:29:02 2010 -0400
 */
(function($) {

	/*
	 * @license 
	 * jQuery Tools / Flashembed - New wave Flash embedding
	 * 
	 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
	 * 
	 * http://flowplayer.org/tools/toolbox/flashembed.html
	 *
	 * Since : March 2008
	 */ 
	(function() {
		
		var IE = document.all,
			 URL = 'http://www.adobe.com/go/getflashplayer',
			 JQUERY = typeof jQuery == 'function', 
			 RE = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/,
			 GLOBAL_OPTS = { 
				// very common opts
				width: '100%',
				height: '100%',		
				id: "_" + ("" + Math.random()).slice(9),
			
				// flashembed defaults
				allowfullscreen: true,
				allowscriptaccess: 'always',
				quality: 'high',	
			
				// flashembed specific options
				version: [3, 0],
				onFail: null,
				expressInstall: null, 
				w3c: false,
				cachebusting: false  		 		 
		};
	
		// version 9 bugfix: (http://blog.deconcept.com/2006/07/28/swfobject-143-released/)
		if (window.attachEvent) {
			window.attachEvent("onbeforeunload", function() {
				__flash_unloadHandler = function() {};
				__flash_savedUnloadHandler = function() {};
			});
		}
	
		// simple extend
		function extend(to, from) {
			if (from) {
				for (var key in from) {
					if (from.hasOwnProperty(key)) {
						to[key] = from[key];
					}
				}
			} 
			return to;
		}	

		// used by asString method	
		function map(arr, func) {
			var newArr = []; 
			for (var i in arr) {
				if (arr.hasOwnProperty(i)) {
					newArr[i] = func(arr[i]);
				}
			}
			return newArr;
		}

		window.flashembed = function(root, opts, conf) {
	
			// root must be found / loaded	
			if (typeof root == 'string') {
				root = document.getElementById(root.replace("#", ""));
			}
		
			// not found
			if (!root) { return; }
		
			if (typeof opts == 'string') {
				opts = {src: opts};	
			}

			return new Flash(root, extend(extend({}, GLOBAL_OPTS), opts), conf); 
		};	
	
		// flashembed "static" API
		var f = extend(window.flashembed, {
		
			conf: GLOBAL_OPTS,
	
			getVersion: function()  {
				var fo, ver;
			
				try {
					ver = navigator.plugins["Shockwave Flash"].description.slice(16); 
				} catch(e) {
				
					try  {
						fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
						ver = fo && fo.GetVariable("$version");
					
					} catch(err) {
	                try  {
	                    fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
	                    ver = fo && fo.GetVariable("$version");  
	                } catch(err2) { } 						
					} 
				}
			
				ver = RE.exec(ver);
				return ver ? [ver[1], ver[3]] : [0, 0];
			},
		
			asString: function(obj) { 

				if (obj === null || obj === undefined) { return null; }
				var type = typeof obj;
				if (type == 'object' && obj.push) { type = 'array'; }
			
				switch (type){  
				
					case 'string':
						obj = obj.replace(new RegExp('(["\\\\])', 'g'), '\\$1');
					
						// flash does not handle %- characters well. transforms "50%" to "50pct" (a dirty hack, I admit)
						obj = obj.replace(/^\s?(\d+\.?\d+)%/, "$1pct");
						return '"' +obj+ '"';
					
					case 'array':
						return '['+ map(obj, function(el) {
							return f.asString(el);
						}).join(',') +']'; 
					
					case 'function':
						return '"function()"';
					
					case 'object':
						var str = [];
						for (var prop in obj) {
							if (obj.hasOwnProperty(prop)) {
								str.push('"'+prop+'":'+ f.asString(obj[prop]));
							}
						}
						return '{'+str.join(',')+'}';
				}
			
				// replace ' --> "  and remove spaces
				return String(obj).replace(/\s/g, " ").replace(/\'/g, "\"");
			},
		
			getHTML: function(opts, conf) {

				opts = extend({}, opts);
			
				/******* OBJECT tag and it's attributes *******/
				var html = '<object width="' + opts.width + 
					'" height="' + opts.height + 
					'" id="' + opts.id + 
					'" name="' + opts.id + '"';
			
				if (opts.cachebusting) {
					opts.src += ((opts.src.indexOf("?") != -1 ? "&" : "?") + Math.random());		
				}			
			
				if (opts.w3c || !IE) {
					html += ' data="' +opts.src+ '" type="application/x-shockwave-flash"';		
				} else {
					html += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';	
				}
			
				html += '>'; 
			
				/******* nested PARAM tags *******/
				if (opts.w3c || IE) {
					html += '<param name="movie" value="' +opts.src+ '" />'; 	
				} 
			
				// not allowed params
				opts.width = opts.height = opts.id = opts.w3c = opts.src = null;
				opts.onFail = opts.version = opts.expressInstall = null;
			
				for (var key in opts) {
					if (opts[key]) {
						html += '<param name="'+ key +'" value="'+ opts[key] +'" />';
					}
				}	
		
				/******* FLASHVARS *******/
				var vars = "";
			
				if (conf) {
					for (var k in conf) { 
						if (conf[k]) {
							var val = conf[k]; 
							vars += k +'='+ (/function|object/.test(typeof val) ? f.asString(val) : val) + '&';
						}
					}
					vars = vars.slice(0, -1);
					html += '<param name="flashvars" value=\'' + vars + '\' />';
				}
			
				html += "</object>";	
			
				return html;				
			},
		
			isSupported: function(ver) {
				return VERSION[0] > ver[0] || VERSION[0] == ver[0] && VERSION[1] >= ver[1];			
			}		
		
		});
	
		var VERSION = f.getVersion(); 
	
		function Flash(root, opts, conf) {  
	                                                
			// version is ok
			if (f.isSupported(opts.version)) {
				root.innerHTML = f.getHTML(opts, conf);
			
			// express install
			} else if (opts.expressInstall && f.isSupported([6, 65])) {
				root.innerHTML = f.getHTML(extend(opts, {src: opts.expressInstall}), {
					MMredirectURL: location.href,
					MMplayerType: 'PlugIn',
					MMdoctitle: document.title
				});	
			
			} else {
			
				// fail #2.1 custom content inside container
				if (!root.innerHTML.replace(/\s/g, '')) {
					root.innerHTML = 
						"<h2>Flash version " + opts.version + " or greater is required</h2>" + 
						"<h3>" + 
							(VERSION[0] > 0 ? "Your version is " + VERSION : "You have no flash plugin installed") +
						"</h3>" + 
					
						(root.tagName == 'A' ? "<p>Click here to download latest version</p>" : 
							"<p>Download latest version from <a href='" + URL + "'>here</a></p>");
					
					if (root.tagName == 'A') {	
						root.onclick = function() {
							location.href = URL;
						};
					}				
				}
			
				// onFail
				if (opts.onFail) {
					var ret = opts.onFail.call(this);
					if (typeof ret == 'string') { root.innerHTML = ret; }	
				}			
			}
		
			// http://flowplayer.org/forum/8/18186#post-18593
			if (IE) {
				window[opts.id] = document.getElementById(opts.id);
			} 
		
			// API methods for callback
			extend(this, {
				
				getRoot: function() {
					return root;	
				},
			
				getOptions: function() {
					return opts;	
				},

			
				getConf: function() {
					return conf;	
				}, 
			
				getApi: function() {
					return root.firstChild;	
				}
			
			}); 
		}
	
		// setup jquery support
		if (JQUERY) {
		
			// tools version number
			jQuery.tools = jQuery.tools || {version: '1.2.4'};
		
			jQuery.tools.flashembed = {  
				conf: GLOBAL_OPTS
			};	
		
			jQuery.fn.flashembed = function(opts, conf) {		
				return this.each(function() { 
					$(this).data("flashembed", flashembed(this, opts, conf));
				});
			}; 
		} 
	
	})();

	// BOTH PLUGINS
	REGEX_CUSTOM_CONTROL = /iphone|ipod|ipad|android/i;
	JQUERY_H264_VERSION = '1.0.7';
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

})(jQuery)