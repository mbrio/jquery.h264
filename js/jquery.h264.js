/*!
 * jquery.h264 library 1.0
 * http://github.com/mbrio/jquery.h264
 *
 * Copyright (c) 2010 Michael Diolosa - http://github.com/mbrio
 * Dual-licensed under the GPL and MIT licenses.
 *
 * The current version supports only JW Player as the video player
 * 
 * jQuery.fn.h264(params, flparams, callbacks)
 *    
 *    @params = The HTML 5 video tag parameters
 *    {
 *    	src = The video file URL
 *    	poster = The poster image URL
 *    	preload = One of the following values 'none', 'metadata', 'auto'
 *    	autoplay = Whether to begin the video on startup
 *    	loop = Whether to loop the video
 *    	controls = Whether to display the controls
 *    	width = The width of the video
 *    	height = The height of the video
 *    }
 *    
 *    @flparams = The Flash parameters
 *    {
 *    	src = The flash player URL
 *    	version = An array containing the version number, example: [9,0,24]
 *    	expressInstall = The express install URL
 *    	w3c = Use standards based markup
 *    	cachebusting = Prevents caching of the Flash file
 *    	bgcolor = The background color of the Flash file
 *    	width = The width of the video
 *    	height = The height of the video
 *    	wmode = The wmode of the flash player
 *    	allowfullscreen = Allow the flash video to support fullscreen
 *    	allowscriptaccess = Allow script access
 *    	quality = The flash quality
 *    	flashvars = The flashvars to pass onto the flash player
 *    }
 *
 *    @callbacks = Functions to call at specific times
 *    {
 *    	complete = A callback on complete
 *    	success = A callback on success
 *    	failure = A callback on failure
 *    }
 *
 */

// flashembed from jQuery Tools
(function(){var IE=document.all,URL='http://www.adobe.com/go/getflashplayer',JQUERY=typeof jQuery=='function',RE=/(\d+)[^\d]+(\d+)[^\d]*(\d*)/,GLOBAL_OPTS={width:'100%',height:'100%',id:"_"+(""+Math.random()).slice(9),allowfullscreen:true,allowscriptaccess:'always',quality:'high',version:[3,0],onFail:null,expressInstall:null,w3c:false,cachebusting:false};if(window.attachEvent){window.attachEvent("onbeforeunload",function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){}})}function extend(to,from){if(from){for(var key in from){if(from.hasOwnProperty(key)){to[key]=from[key]}}}return to}function map(arr,func){var newArr=[];for(var i in arr){if(arr.hasOwnProperty(i)){newArr[i]=func(arr[i])}}return newArr}window.flashembed=function(root,opts,conf){if(typeof root=='string'){root=document.getElementById(root.replace("#",""))}if(!root){return}if(typeof opts=='string'){opts={src:opts}}return new Flash(root,extend(extend({},GLOBAL_OPTS),opts),conf)};var f=extend(window.flashembed,{conf:GLOBAL_OPTS,getVersion:function(){var fo,ver;try{ver=navigator.plugins["Shockwave Flash"].description.slice(16)}catch(e){try{fo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");ver=fo&&fo.GetVariable("$version")}catch(err){try{fo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");ver=fo&&fo.GetVariable("$version")}catch(err2){}}}ver=RE.exec(ver);return ver?[ver[1],ver[3]]:[0,0]},asString:function(obj){if(obj===null||obj===undefined){return null}var type=typeof obj;if(type=='object'&&obj.push){type='array'}switch(type){case'string':obj=obj.replace(new RegExp('(["\\\\])','g'),'\\$1');obj=obj.replace(/^\s?(\d+\.?\d+)%/,"$1pct");return'"'+obj+'"';case'array':return'['+map(obj,function(el){return f.asString(el)}).join(',')+']';case'function':return'"function()"';case'object':var str=[];for(var prop in obj){if(obj.hasOwnProperty(prop)){str.push('"'+prop+'":'+f.asString(obj[prop]))}}return'{'+str.join(',')+'}'}return String(obj).replace(/\s/g," ").replace(/\'/g,"\"")},getHTML:function(opts,conf){opts=extend({},opts);var html='<object width="'+opts.width+'" height="'+opts.height+'" id="'+opts.id+'" name="'+opts.id+'"';if(opts.cachebusting){opts.src+=((opts.src.indexOf("?")!=-1?"&":"?")+Math.random())}if(opts.w3c||!IE){html+=' data="'+opts.src+'" type="application/x-shockwave-flash"'}else{html+=' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'}html+='>';if(opts.w3c||IE){html+='<param name="movie" value="'+opts.src+'" />'}opts.width=opts.height=opts.id=opts.w3c=opts.src=null;opts.onFail=opts.version=opts.expressInstall=null;for(var key in opts){if(opts[key]){html+='<param name="'+key+'" value="'+opts[key]+'" />'}}var vars="";if(conf){for(var k in conf){if(conf[k]){var val=conf[k];vars+=k+'='+(/function|object/.test(typeof val)?f.asString(val):val)+'&'}}vars=vars.slice(0,-1);html+='<param name="flashvars" value=\''+vars+'\' />'}html+="</object>";return html},isSupported:function(ver){return VERSION[0]>ver[0]||VERSION[0]==ver[0]&&VERSION[1]>=ver[1]}});var VERSION=f.getVersion();function Flash(root,opts,conf){if(f.isSupported(opts.version)){root.innerHTML=f.getHTML(opts,conf)}else if(opts.expressInstall&&f.isSupported([6,65])){root.innerHTML=f.getHTML(extend(opts,{src:opts.expressInstall}),{MMredirectURL:location.href,MMplayerType:'PlugIn',MMdoctitle:document.title})}else{if(!root.innerHTML.replace(/\s/g,'')){root.innerHTML="<h2>Flash version "+opts.version+" or greater is required</h2>"+"<h3>"+(VERSION[0]>0?"Your version is "+VERSION:"You have no flash plugin installed")+"</h3>"+(root.tagName=='A'?"<p>Click here to download latest version</p>":"<p>Download latest version from <a href='"+URL+"'>here</a></p>");if(root.tagName=='A'){root.onclick=function(){location.href=URL}}}if(opts.onFail){var ret=opts.onFail.call(this);if(typeof ret=='string'){root.innerHTML=ret}}}if(IE){window[opts.id]=document.getElementById(opts.id)}extend(this,{getRoot:function(){return root},getOptions:function(){return opts},getConf:function(){return conf},getApi:function(){return root.firstChild}})}if(JQUERY){jQuery.tools=jQuery.tools||{version:'@VERSION'};jQuery.tools.flashembed={conf:GLOBAL_OPTS};jQuery.fn.flashembed=function(opts,conf){return this.each(function(){$(this).data("flashembed",flashembed(this,opts,conf))})}}})();

(function($) {
	$.h264 = {
		version: '1.0',
		useVideoTag: function() {
			var obj = document.createElement("video");
			return (typeof(obj.canPlayType) !== 'undefined' && obj.canPlayType('video/mp4; codecs="avc1.42E01E"'));
		},
		isMobile: function() {
			var ua = navigator.userAgent.toLowerCase();
			var a = ["iphone","ipod","android"];
			var l = a.length;

			for(var x = 0; x < l; x++) {
				if(ua.search(a[x]) > -1) return true;
			}
			
			return false;
		}
	};
	
	var VideoPlayer = function(video, controls) {
		this.percentComplete = 0;
		this.percentLoaded = 0;
		
		this.videoElement = video.get(0);
		this.video = video;
		
		this.controlsElement = controls.get(0);
		this.controls = controls;
		
		this.playButton = this.controls.find(".jquery-h264-play-button");
		this.gutter = this.controls.find(".jquery-h264-gutter");
		this.playhead = this.controls.find(".jquery-h264-playhead");
		this.progress = this.controls.find(".jquery-h264-progress");
		
		this.init_();
	}
	
	VideoPlayer.prototype.init_ = function() {		
		this.playhead.css("width", 1);
		
		
		this.video.bind("timeupdate", $.proxy(this.updatePercentComplete_, this));
		this.video.bind("progress", $.proxy(this.updatePercentLoaded_, this));
		
		this.video.bind("play", $.proxy(this.displayPlaying_, this));
		this.video.bind("pause", $.proxy(this.displayPaused_, this));
		this.video.bind("ended", $.proxy(this.displayPaused_, this));
				
		this.playButton.click($.proxy(this.togglePlay, this));
	}
	
	VideoPlayer.prototype.displayPlaying_ = function() {
		this.controls.addClass("playing");
	}
	
	VideoPlayer.prototype.displayPaused_ = function() {
		this.controls.removeClass("playing");
	}	
	
	VideoPlayer.prototype.updatePercentComplete_ = function() {
		this.percentComplete = (this.videoElement.currentTime * 100 / this.videoElement.duration) / 100;
		this.update();
	}
	
	VideoPlayer.prototype.updatePercentLoaded_ = function() {
		this.percentLoaded = (this.videoElement.buffered.end() * 100 / this.videoElement.duration) / 100;
		this.update();
	}
	
	VideoPlayer.prototype.update = function() {
		this.playhead.css("width", this.gutter.width() * this.percentComplete);
		this.progress.css("width", this.gutter.width() * this.percentLoaded);
	}
	
	VideoPlayer.prototype.togglePlay = function() {
		if (this.controls.hasClass("playing")) this.pause();
		else this.play();
	}
	
	VideoPlayer.prototype.play = function() {
		this.videoElement.play();
	}
	
	VideoPlayer.prototype.pause = function() {
		this.videoElement.pause();
	}

	$.fn.h264HTML5_ = function(params, flparams, callbacks) {
		var ele = null;
		
		var controls = this.find(".jquery-h264-video-controls");
		if (controls.size() > 0) params.controls = null;
		
		if (params.poster && !params.autoplay && !$.h264.isMobile()) {
			var play = $("<div>").addClass("jquery-h264-play");
			ele = $("<div>").css({
				width: params.width,
				height: params.height,
				"background": "transparent url(" + params.poster + ") no-repeat",
				cursor: "pointer",
				position: "relative"
			}).addClass("jquery-h264-poster").click(function() {
				var vid = $("<video>").attr(params).addClass("jquery-h264-video");
				var player = new VideoPlayer(vid, controls);
				
				var videoContainer = $("<div>").css({
					width: params.width,
					height: params.height,
					position: 'absolute'
				}).mouseenter(function() {
					controls.fadeIn(250);
					player.update();
				}).mouseleave(function() {
					controls.fadeOut(250);
					player.update();
				});
				
				videoContainer.append(vid);
				videoContainer.append(controls);

				$(this).replaceWith(videoContainer);
				
				/*
					Found Safari 5 would not allow for playback immediately
					therefore a timeout is necessary.
				*/
				setTimeout(function() {player.play()}, 100);
			}).append(play);
		} else {
			ele = $("<video>").attr(params).addClass("jquery-h264-video");
		}
		
		this.empty();
		this.append(ele);
		
		if ($.isFunction(callbacks.success)) callbacks.success(this);
	};
	
	$.fn.h264Flash_ = function(params, flparams, callbacks) {
		var failed = false;
		var flashvars = flparams.flashvars;
		flparams.flashvars = null;
		
		flparams = $.extend({
			onFail: function() { failed = true; }
		}, flparams);
		
		this.flashembed(flparams, flashvars);

		if (failed && $.isFunction(callbacks.failure)) callbacks.failure(this);
		if (!failed && $.isFunction(callbacks.success)) callbacks.success(this);
	};
	
	if ($.h264.useVideoTag()) $.fn.h264_ = $.fn.h264HTML5_;
    else $.fn.h264_ = $.fn.h264Flash_;
	
	$.fn.h264 = function(params, flparams, callbacks) {
		if (!$.isPlainObject(params)) params = { src: params };
		if (!$.isPlainObject(callbacks)) callbacks = { complete: callbacks };
		
		params = $.extend({
			src: null,
			poster: null,
			preload: 'none',
			autoplay: null,
			loop: null,
			controls: 'controls',
			width: '100%',
			height: '100%'
		}, params);
		
		flparams = $.extend({
			src: null,
			version: [9],
			expressInstall: null,
			w3c: false,
			cachebusting: false,
			bgcolor: null,
			width: params.width,
			height: params.height,
			wmode: 'opaque',
			allowfullscreen: true,
            allowscriptaccess: 'always',
			quality: 'high',
			flashvars: {}
		}, flparams);
		
		callbacks = $.extend({
			complete: null,
			success: null,
			failure: null
		}, callbacks);
		
		this.h264_(params, flparams, callbacks);
		
		if ($.isFunction(callbacks.complete)) callbacks.complete(this);
	};
})(jQuery);